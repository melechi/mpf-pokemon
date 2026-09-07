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
    <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5">
      <SearchBar query={query} onQueryChange={handleQueryChange} />

      {isError ? (
        <EmptyState
          variant="error"
          role="alert"
          title="Oops — the net slipped!"
          description="We couldn't reach the Pokémon library. Let's try that again."
          action={
            <button
              type="button"
              onClick={() => refetch()}
              className="min-h-12 rounded-2xl bg-berry px-6 font-extrabold text-white shadow-[0_3px_0_#A62622] transition active:translate-y-[3px] active:shadow-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-berry/35"
            >
              Retry
            </button>
          }
        />
      ) : isLoading ? (
        <PokemonGrid items={[]} isLoading skeletonCount={pageSize} />
      ) : total === 0 ? (
        <EmptyState
          variant="no-results"
          title={
            query.trim()
              ? `No Pokémon called “${query.trim()}”`
              : 'No Pokémon found'
          }
          description={
            query.trim()
              ? 'Check the spelling, or try a shorter word.'
              : 'The Pokémon library is empty.'
          }
          action={
            query.trim() ? (
              <button
                type="button"
                onClick={() => handleQueryChange('')}
                className="min-h-12 rounded-2xl border-2 border-line bg-white px-6 font-extrabold text-stone-600 transition hover:border-stone-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-berry/35"
              >
                Clear search
              </button>
            ) : undefined
          }
        />
      ) : (
        <>
          <p className="text-sm font-bold text-stone-500">
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
