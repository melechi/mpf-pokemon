import { z } from 'zod'
import { idFromUrl, spriteUrl } from '@/api/client'

// Model ONLY the fields we consume from the PokéAPI, parsed and trimmed.
// Types are derived via z.infer — do not hand-write them.

/** A single entry from the `/pokemon` index list: `{ name, url }` -> `{ id, name }`. */
export const pokemonListItemSchema = z
  .object({
    name: z.string(),
    url: z.string(),
  })
  .transform(({ name, url }) => ({
    id: idFromUrl(url),
    name,
  }))

export type PokemonListItem = z.infer<typeof pokemonListItemSchema>

/** The `/pokemon` index response — we keep only `results`. */
export const pokemonIndexSchema = z
  .object({
    results: z.array(pokemonListItemSchema),
  })
  .transform(({ results }) => results)

/**
 * A `/pokemon/{id|name}` detail response, trimmed to the fields we use.
 * `types` is flattened to `string[]`; `spriteUrl` is derived from the id.
 */
export const pokemonSchema = z
  .object({
    id: z.number(),
    name: z.string(),
    types: z.array(
      z.object({
        type: z.object({ name: z.string() }),
      }),
    ),
  })
  .transform(({ id, name, types }) => ({
    id,
    name,
    types: types.map((t) => t.type.name),
    spriteUrl: spriteUrl(id),
  }))

export type Pokemon = z.infer<typeof pokemonSchema>
