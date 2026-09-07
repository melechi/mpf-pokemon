import { useQuery } from '@tanstack/react-query'
import { fetchPokemonIndex } from '@/api/pokemon'
import { pokemonKeys } from '@/queries/keys'

/**
 * Load the full Pokémon index once and cache it forever (staleTime: Infinity).
 * Filtering/pagination happen client-side over the returned array.
 */
export function usePokemonIndex() {
  return useQuery({
    queryKey: pokemonKeys.index(),
    queryFn: fetchPokemonIndex,
    staleTime: Infinity,
  })
}
