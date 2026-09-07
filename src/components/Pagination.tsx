type PaginationProps = {
  page: number
  pageCount: number
  onPageChange: (page: number) => void
}

const BTN =
  'min-h-12 min-w-14 rounded-[18px] bg-berry px-4 font-extrabold text-white shadow-[0_3px_0_#A62622] transition active:translate-y-[3px] active:shadow-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-berry/35 disabled:cursor-not-allowed disabled:bg-white disabled:text-stone-300 disabled:shadow-[0_2px_0_rgba(43,42,51,.06)] disabled:active:translate-y-0'

/** Previous / next pager with a "Page X of Y" indicator. */
function Pagination({ page, pageCount, onPageChange }: PaginationProps) {
  const atStart = page <= 1
  const atEnd = page >= pageCount

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-3 pt-1"
    >
      <button
        type="button"
        className={BTN}
        onClick={() => onPageChange(page - 1)}
        disabled={atStart}
        aria-label="Previous page"
      >
        Prev
      </button>
      <span
        className="font-display text-base font-bold text-zinc-700"
        aria-live="polite"
      >
        Page {page} of {pageCount}
      </span>
      <button
        type="button"
        className={BTN}
        onClick={() => onPageChange(page + 1)}
        disabled={atEnd}
        aria-label="Next page"
      >
        Next
      </button>
    </nav>
  )
}

export default Pagination
