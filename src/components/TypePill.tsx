import { cn } from '@/lib/cn'
import { typeClass } from '@/state/colors'

/** A small coloured pill naming a Pokémon type. */
function TypePill({ type }: { type: string }) {
  return (
    <span
      className={cn(
        'inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize',
        typeClass(type),
      )}
    >
      {type}
    </span>
  )
}

export default TypePill
