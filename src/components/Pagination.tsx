import { cn } from '@/lib/cn'

type PaginationProps = {
  page: number
  pageCount: number
  onPageChange: (page: number) => void
}

const BTN =
  'rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 disabled:cursor-not-allowed disabled:opacity-40'

/** Previous / next pager with a "Page X of Y" indicator. */
function Pagination({ page, pageCount, onPageChange }: PaginationProps) {
  const atStart = page <= 1
  const atEnd = page >= pageCount

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-4 py-2"
    >
      <button
        type="button"
        className={cn(BTN)}
        onClick={() => onPageChange(page - 1)}
        disabled={atStart}
        aria-label="Previous page"
      >
        ← Prev
      </button>
      <span className="text-sm text-slate-600" aria-live="polite">
        Page <span className="font-semibold">{page}</span> of {pageCount}
      </span>
      <button
        type="button"
        className={cn(BTN)}
        onClick={() => onPageChange(page + 1)}
        disabled={atEnd}
        aria-label="Next page"
      >
        Next →
      </button>
    </nav>
  )
}

export default Pagination
