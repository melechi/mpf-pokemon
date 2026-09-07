import type { Pokemon } from '@/api/schemas'
import type { PokemonSummary } from '@/state/types'

/**
 * Build a stored PokemonSummary from a fetched Pokemon, stamping `addedAt` with
 * the given timestamp (per-membership; the same Pokémon added to three groups
 * gets three timestamps).
 */
export function toSummary(pokemon: Pokemon, now: number): PokemonSummary {
  return {
    id: pokemon.id,
    name: pokemon.name,
    spriteUrl: pokemon.spriteUrl,
    types: pokemon.types,
    addedAt: now,
  }
}
