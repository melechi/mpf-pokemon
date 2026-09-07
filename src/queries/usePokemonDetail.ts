import { useQuery } from '@tanstack/react-query'
import { fetchPokemon } from '@/api/pokemon'
import { pokemonKeys } from '@/queries/keys'

/** Load a single Pokémon's detail by id or name. */
export function usePokemonDetail(nameOrId: string | number | undefined) {
  return useQuery({
    queryKey: pokemonKeys.detail(nameOrId ?? ''),
    queryFn: () => fetchPokemon(nameOrId as string | number),
    enabled: nameOrId !== undefined && nameOrId !== '',
  })
}
