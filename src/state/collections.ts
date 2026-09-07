import { atom } from 'jotai'
import { GROUP_COLORS, type ColorToken } from '@/state/colors'
import { userDataAtom } from '@/state/storage'
import {
  FAVOURITES_ID,
  type Group,
  type PokemonSummary,
  type UserData,
} from '@/state/types'

// ---------------------------------------------------------------------------
// Pure transitions over UserData (UserData -> UserData). No Jotai in here, so
// all the logic is testable without a store.
// ---------------------------------------------------------------------------

function requireGroup(data: UserData, groupId: string): Group {
  const group = data.groups[groupId]
  if (group === undefined) {
    throw new Error(`Unknown group: ${groupId}`)
  }
  return group
}

/** Add a Pokémon to a group. Idempotent by id — adding twice leaves one member. */
export function addToGroup(
  data: UserData,
  groupId: string,
  summary: PokemonSummary,
): UserData {
  const group = requireGroup(data, groupId)
  if (group.members.some((m) => m.id === summary.id)) return data
  return {
    ...data,
    groups: {
      ...data.groups,
      [groupId]: { ...group, members: [...group.members, summary] },
    },
  }
}

/** Remove a Pokémon from a single group; membership in other groups is untouched. */
export function removeFromGroup(
  data: UserData,
  groupId: string,
  pokemonId: number,
): UserData {
  const group = requireGroup(data, groupId)
  return {
    ...data,
    groups: {
      ...data.groups,
      [groupId]: {
        ...group,
        members: group.members.filter((m) => m.id !== pokemonId),
      },
    },
  }
}

/** Toggle a Pokémon's membership in Favourites only. */
export function toggleFavourite(
  data: UserData,
  summary: PokemonSummary,
): UserData {
  const favourites = requireGroup(data, FAVOURITES_ID)
  const present = favourites.members.some((m) => m.id === summary.id)
  return present
    ? removeFromGroup(data, FAVOURITES_ID, summary.id)
    : addToGroup(data, FAVOURITES_ID, summary)
}

/** Pick a palette colour for the next group — cycles the palette, never the reserved colour. */
function nextGroupColor(data: UserData): ColorToken {
  const userGroupCount = data.groupOrder.length - 1 // exclude Favourites
  return GROUP_COLORS[userGroupCount % GROUP_COLORS.length] ?? GROUP_COLORS[0]
}

/** Create a new user group with a palette colour (never the reserved one). */
export function createGroup(
  data: UserData,
  input: { id: string; name: string; now: number },
): UserData {
  if (data.groups[input.id] !== undefined) {
    throw new Error(`Group id already exists: ${input.id}`)
  }
  const group: Group = {
    id: input.id,
    name: input.name,
    color: nextGroupColor(data),
    members: [],
    createdAt: input.now,
  }
  return {
    ...data,
    groups: { ...data.groups, [input.id]: group },
    groupOrder: [...data.groupOrder, input.id],
  }
}

/** Delete a user group. Favourites cannot be deleted. */
export function deleteGroup(data: UserData, groupId: string): UserData {
  if (groupId === FAVOURITES_ID) {
    throw new Error('Cannot delete the Favourites group')
  }
  if (data.groups[groupId] === undefined) return data
  const groups = { ...data.groups }
  delete groups[groupId]
  return {
    ...data,
    groups,
    groupOrder: data.groupOrder.filter((id) => id !== groupId),
  }
}

/** Rename a user group. Favourites cannot be renamed. */
export function renameGroup(
  data: UserData,
  groupId: string,
  name: string,
): UserData {
  if (groupId === FAVOURITES_ID) {
    throw new Error('Cannot rename the Favourites group')
  }
  const group = requireGroup(data, groupId)
  return {
    ...data,
    groups: { ...data.groups, [groupId]: { ...group, name } },
  }
}

/** Ids of the groups (in groupOrder) that contain the given Pokémon. */
export function groupIdsContaining(
  data: UserData,
  pokemonId: number,
): string[] {
  return data.groupOrder.filter((id) => {
    const group = data.groups[id]
    return group !== undefined && group.members.some((m) => m.id === pokemonId)
  })
}

// ---------------------------------------------------------------------------
// Derived read atoms
// ---------------------------------------------------------------------------

/** Groups in display order (following groupOrder). */
export const orderedGroupsAtom = atom((get) => {
  const data = get(userDataAtom)
  return data.groupOrder
    .map((id) => data.groups[id])
    .filter((g): g is Group => g !== undefined)
})

/** The Favourites group (guaranteed to exist by the storage layer). */
export const favouritesAtom = atom((get) =>
  requireGroup(get(userDataAtom), FAVOURITES_ID),
)

// ---------------------------------------------------------------------------
// Write action atoms — thin wrappers that run the pure transitions.
// ---------------------------------------------------------------------------

export const addToGroupAtom = atom(
  null,
  (get, set, payload: { groupId: string; summary: PokemonSummary }) => {
    // Stamp addedAt per membership at the moment of adding.
    const summary = { ...payload.summary, addedAt: Date.now() }
    set(userDataAtom, addToGroup(get(userDataAtom), payload.groupId, summary))
  },
)

export const removeFromGroupAtom = atom(
  null,
  (get, set, payload: { groupId: string; pokemonId: number }) => {
    set(
      userDataAtom,
      removeFromGroup(get(userDataAtom), payload.groupId, payload.pokemonId),
    )
  },
)

export const toggleFavouriteAtom = atom(
  null,
  (get, set, summary: PokemonSummary) => {
    set(userDataAtom, toggleFavourite(get(userDataAtom), summary))
  },
)

export const createGroupAtom = atom(null, (get, set, name: string): string => {
  const id = crypto.randomUUID()
  set(
    userDataAtom,
    createGroup(get(userDataAtom), { id, name, now: Date.now() }),
  )
  return id
})

export const deleteGroupAtom = atom(null, (get, set, groupId: string) => {
  set(userDataAtom, deleteGroup(get(userDataAtom), groupId))
})

export const renameGroupAtom = atom(
  null,
  (get, set, payload: { groupId: string; name: string }) => {
    set(
      userDataAtom,
      renameGroup(get(userDataAtom), payload.groupId, payload.name),
    )
  },
)
