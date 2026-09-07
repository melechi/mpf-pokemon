import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import EmptyState from '@/components/EmptyState'
import Pagination from '@/components/Pagination'
import PokemonGrid from '@/components/PokemonGrid'
import SearchBar from '@/components/SearchBar'
import { usePokemonBrowse } from '@/queries/usePokemonBrowse'

// Query-string param names — keep these stable across phases.
const QUERY_PARAM = 'q'
const PAGE_PARAM = 'page'

function BrowsePage() {
  const [params, setParams] = useSearchParams()

  const query = params.get(QUERY_PARAM) ?? ''
  const page = Math.max(1, Number(params.get(PAGE_PARAM) ?? '1') || 1)

  const { items, total, totalPages, pageSize, isLoading, isError, refetch } =
    usePokemonBrowse({ query, page })

  const handleQueryChange = useCallback(
    (next: string) => {
      setParams(
        (prev) => {
          const p = new URLSearchParams(prev)
          if (next.trim()) p.set(QUERY_PARAM, next)
          else p.delete(QUERY_PARAM)
          p.set(PAGE_PARAM, '1') // reset to page 1 whenever the query changes
          return p
        },
        { replace: true },
      )
    },
    [setParams],
  )

  const handlePageChange = useCallback(
    (next: number) => {
      setParams((prev) => {
        const p = new URLSearchParams(prev)
        p.set(PAGE_PARAM, String(next))
        return p
      })
    },
    [setParams],
  )

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6">
      <SearchBar query={query} onQueryChange={handleQueryChange} />

      {isError ? (
        <EmptyState
          title="Couldn't load Pokémon"
          description="Something went wrong while fetching the Pokédex."
          action={
            <button
              type="button"
              onClick={() => refetch()}
              className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              Retry
            </button>
          }
        />
      ) : isLoading ? (
        <PokemonGrid items={[]} isLoading skeletonCount={pageSize} />
      ) : total === 0 ? (
        <EmptyState
          title="No Pokémon found"
          description={
            query.trim()
              ? `Nothing matches “${query.trim()}”. Try a different name.`
              : 'The Pokédex is empty.'
          }
        />
      ) : (
        <>
          <p className="text-sm text-slate-500">
            {total} Pokémon{query.trim() ? ` matching “${query.trim()}”` : ''}
          </p>
          <PokemonGrid items={items} />
          {totalPages > 1 && (
            <Pagination
              page={page}
              pageCount={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  )
}

export default BrowsePage
