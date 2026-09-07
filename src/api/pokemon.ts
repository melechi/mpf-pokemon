import { apiFetch } from '@/api/client'
import {
  pokemonIndexSchema,
  pokemonSchema,
  type Pokemon,
  type PokemonListItem,
} from '@/api/schemas'

/**
 * Fetch the full Pokémon index in one request. There is no search endpoint, so
 * we pull everything once and filter client-side (cached with staleTime:
 * Infinity by the query hook).
 */
export async function fetchPokemonIndex(): Promise<PokemonListItem[]> {
  const data = await apiFetch('/pokemon?limit=100000')
  return pokemonIndexSchema.parse(data)
}

/** Fetch a single Pokémon's detail by id or name. */
export async function fetchPokemon(
  nameOrId: string | number,
): Promise<Pokemon> {
  const data = await apiFetch(`/pokemon/${nameOrId}`)
  return pokemonSchema.parse(data)
}
