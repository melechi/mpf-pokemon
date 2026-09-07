import { useMemo } from 'react'
import { filterPokemon, pageCount, paginate, PAGE_SIZE } from '@/api/search'
import { usePokemonIndex } from '@/queries/usePokemonIndex'

/**
 * Compose the cached full index with the client-side search + pagination
 * transforms. Kept in queries/ so components never reach into api/ directly.
 */
export function usePokemonBrowse({
  query,
  page,
}: {
  query: string
  page: number
}) {
  const index = usePokemonIndex()

  const all = useMemo(() => index.data ?? [], [index.data])
  const filtered = useMemo(() => filterPokemon(all, query), [all, query])
  const items = useMemo(() => paginate(filtered, page), [filtered, page])

  return {
    items,
    total: filtered.length,
    totalPages: pageCount(filtered.length),
    pageSize: PAGE_SIZE,
    isLoading: index.isLoading,
    isError: index.isError,
    isSuccess: index.isSuccess,
    refetch: index.refetch,
  }
}
