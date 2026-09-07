import { describe, expect, it } from 'vitest'
import {
  addToGroup,
  createGroup,
  deleteGroup,
  groupIdsContaining,
  removeFromGroup,
  renameGroup,
  toggleFavourite,
} from '@/state/collections'
import { FAVOURITES_COLOR, GROUP_COLORS } from '@/state/colors'
import {
  defaultUserData,
  FAVOURITES_ID,
  type PokemonSummary,
} from '@/state/types'

const summary = (id: number, name: string, addedAt = 1): PokemonSummary => ({
  id,
  name,
  spriteUrl: null,
  types: [],
  addedAt,
})

describe('defaultUserData', () => {
  it('contains Favourites, first in order', () => {
    const data = defaultUserData(0)
    expect(data.groups[FAVOURITES_ID]).toBeDefined()
    expect(data.groupOrder[0]).toBe(FAVOURITES_ID)
  })
})

describe('addToGroup', () => {
  it('adding the same Pokémon twice leaves one member', () => {
    let data = defaultUserData(0)
    data = addToGroup(data, FAVOURITES_ID, summary(25, 'pikachu'))
    data = addToGroup(data, FAVOURITES_ID, summary(25, 'pikachu'))
    expect(data.groups[FAVOURITES_ID]!.members).toHaveLength(1)
  })
})

describe('removeFromGroup', () => {
  it('leaves the same Pokémon in other groups untouched', () => {
    let data = createGroup(defaultUserData(0), {
      id: 'g1',
      name: 'Team',
      now: 0,
    })
    data = addToGroup(data, FAVOURITES_ID, summary(25, 'pikachu'))
    data = addToGroup(data, 'g1', summary(25, 'pikachu'))

    const after = removeFromGroup(data, 'g1', 25)
    expect(after.groups['g1']!.members).toHaveLength(0)
    expect(after.groups[FAVOURITES_ID]!.members.map((m) => m.id)).toContain(25)
  })
})

describe('toggleFavourite', () => {
  it('off removes from Favourites only', () => {
    let data = createGroup(defaultUserData(0), {
      id: 'g1',
      name: 'Team',
      now: 0,
    })
    const pk = summary(25, 'pikachu')
    data = toggleFavourite(data, pk) // on -> into Favourites
    data = addToGroup(data, 'g1', pk) // also in g1

    const off = toggleFavourite(data, pk) // off -> out of Favourites
    expect(off.groups[FAVOURITES_ID]!.members).toHaveLength(0)
    expect(off.groups['g1']!.members.map((m) => m.id)).toEqual([25])
  })
})

describe('deleteGroup / renameGroup', () => {
  it('deleteGroup(FAVOURITES_ID) throws', () => {
    expect(() => deleteGroup(defaultUserData(0), FAVOURITES_ID)).toThrow()
  })

  it('renameGroup(FAVOURITES_ID) throws', () => {
    expect(() =>
      renameGroup(defaultUserData(0), FAVOURITES_ID, 'Nope'),
    ).toThrow()
  })
})

describe('groupIdsContaining', () => {
  it('lists (in order) the groups that contain a Pokémon', () => {
    let data = createGroup(defaultUserData(0), {
      id: 'g1',
      name: 'Team',
      now: 0,
    })
    data = createGroup(data, { id: 'g2', name: 'Bench', now: 0 })
    data = addToGroup(data, FAVOURITES_ID, summary(25, 'pikachu'))
    data = addToGroup(data, 'g2', summary(25, 'pikachu'))

    expect(groupIdsContaining(data, 25)).toEqual([FAVOURITES_ID, 'g2'])
    expect(groupIdsContaining(data, 999)).toEqual([])
  })
})

describe('createGroup', () => {
  it('assigns a colour from the palette, never the reserved one', () => {
    const data = createGroup(defaultUserData(0), {
      id: 'g1',
      name: 'Team',
      now: 0,
    })
    const color = data.groups['g1']!.color
    expect(GROUP_COLORS as readonly string[]).toContain(color)
    expect(color).not.toBe(FAVOURITES_COLOR)
  })
})
