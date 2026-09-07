import { cn } from '@/lib/cn'

type StarButtonProps = {
  active: boolean
  disabled?: boolean
  onToggle: () => void
  label?: string
}

/** A toggle button that stars/unstars, shown as a filled or outline star icon. */
function StarButton({
  active,
  disabled = false,
  onToggle,
  label = 'favourite',
}: StarButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      aria-pressed={active}
      aria-label={active ? `Remove from ${label}` : `Add to ${label}`}
      title={active ? `Remove from ${label}` : `Add to ${label}`}
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500',
        disabled
          ? 'cursor-not-allowed text-slate-300'
          : active
            ? 'text-amber-500 hover:bg-amber-50'
            : 'text-slate-400 hover:bg-slate-100 hover:text-amber-500',
      )}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill={active ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 2.5l2.9 5.88 6.49.94-4.7 4.58 1.11 6.46L12 17.77l-5.8 3.05 1.1-6.46-4.69-4.58 6.49-.94L12 2.5z" />
      </svg>
    </button>
  )
}

export default StarButton
