// Base URL, fetch wrapper, and URL/sprite helpers for the PokéAPI.
// This module must not import React (enforced by convention).

export const BASE_URL = 'https://pokeapi.co/api/v2'

// Official artwork CDN. Sprites are derived from a Pokémon id, never fetched.
const OFFICIAL_ARTWORK_BASE =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork'

/** Build the official-artwork sprite URL for a given Pokémon id. */
export function spriteUrl(id: number): string {
  return `${OFFICIAL_ARTWORK_BASE}/${id}.png`
}

/**
 * Extract a Pokémon id from a PokéAPI resource URL.
 *
 * This is the ONE place id-from-url extraction lives — do not duplicate it.
 * e.g. "https://pokeapi.co/api/v2/pokemon/25/" -> 25
 */
export function idFromUrl(url: string): number {
  const match = /(\d+)\/?$/.exec(url.trim())
  const raw = match?.[1]
  if (raw === undefined) {
    throw new Error(`Cannot extract id from url: ${url}`)
  }
  return Number(raw)
}

/**
 * Fetch a PokéAPI path (relative to BASE_URL) and return the parsed JSON as
 * `unknown`. Callers validate the shape with a Zod schema. Non-2xx throws so
 * React Query treats it as an error.
 */
export async function apiFetch(path: string): Promise<unknown> {
  const res = await fetch(`${BASE_URL}${path}`)
  if (!res.ok) {
    throw new Error(
      `PokéAPI request failed (${res.status} ${res.statusText}): ${path}`,
    )
  }
  return res.json()
}
