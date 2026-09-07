import { cn } from '@/lib/cn'

type StarButtonProps = {
  active: boolean
  disabled?: boolean
  onToggle: () => void
  label?: string
  className?: string
}

/**
 * A toggle button that stars/unstars. State is shown by a filled gold pill +
 * `aria-pressed` (never colour alone). A burst ring flashes on activation.
 */
function StarButton({
  active,
  disabled = false,
  onToggle,
  label = 'favourites',
  className,
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
        'group relative grid size-11 place-items-center rounded-full bg-[#FFFDF7] shadow-[0_2px_6px_rgba(43,42,51,.2)] transition',
        'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-berry/35',
        'active:scale-90 aria-pressed:bg-amber-400 aria-pressed:ring-4 aria-pressed:ring-amber-400/30',
        disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="text-[22px] leading-none text-stone-300 transition-colors group-aria-pressed:text-amber-950 group-aria-pressed:animate-[cc-pop_.45s_cubic-bezier(.2,.9,.3,1.4)]"
      >
        ★
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-3.5 rounded-full border-[3px] border-amber-400 opacity-0 group-aria-pressed:animate-[cc-burst_.9s_ease-out]"
      />
    </button>
  )
}

export default StarButton
