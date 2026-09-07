import { z } from 'zod'
import { FAVOURITES_COLOR } from '@/state/colors'

// UserData, Group, PokemonSummary — Zod schemas and their inferred types.
// Types are derived via z.infer; do not hand-write them.

/** Reserved id for the always-present Favourites group. */
export const FAVOURITES_ID = 'favourites'

export const pokemonSummarySchema = z.object({
  id: z.number(),
  name: z.string(),
  spriteUrl: z.string().nullable(),
  types: z.array(z.string()),
  addedAt: z.number(),
})
export type PokemonSummary = z.infer<typeof pokemonSummarySchema>

export const groupSchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string(),
  members: z.array(pokemonSummarySchema),
  createdAt: z.number(),
})
export type Group = z.infer<typeof groupSchema>

/**
 * The whole persisted store. The schema REQUIRES Favourites to exist and to be
 * first in groupOrder — so a stored value missing or misordering Favourites
 * fails validation and the storage layer recovers to a fresh default.
 * Downstream code may therefore assume Favourites always exists.
 */
export const userDataSchema = z
  .object({
    version: z.literal(1),
    groups: z.record(z.string(), groupSchema),
    groupOrder: z.array(z.string()),
  })
  .refine(
    (data) =>
      data.groups[FAVOURITES_ID] !== undefined &&
      data.groupOrder[0] === FAVOURITES_ID,
    { message: 'Favourites must exist and be first in groupOrder' },
  )
export type UserData = z.infer<typeof userDataSchema>

/**
 * A fresh store with Favourites already present: reserved id, first in
 * groupOrder, reserved colour, empty members. Favourites is never created lazily.
 */
export function defaultUserData(now: number = Date.now()): UserData {
  return {
    version: 1,
    groups: {
      [FAVOURITES_ID]: {
        id: FAVOURITES_ID,
        name: 'Favourites',
        color: FAVOURITES_COLOR,
        members: [],
        createdAt: now,
      },
    },
    groupOrder: [FAVOURITES_ID],
  }
}
