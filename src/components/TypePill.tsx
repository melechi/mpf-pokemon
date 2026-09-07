import { cn } from '@/lib/cn'
import { typeClass } from '@/state/colors'

/** A small coloured pill naming a Pokémon type. */
function TypePill({ type }: { type: string }) {
  return (
    <span
      className={cn(
        'inline-block rounded-full px-3 py-1.5 text-xs font-extrabold capitalize shadow-[0_2px_0_rgba(0,0,0,.12)] animate-[cc-wiggle_.3s_ease-out_both]',
        typeClass(type),
      )}
    >
      {type}
    </span>
  )
}

export default TypePill
