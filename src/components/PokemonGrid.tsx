import PokemonCard, { type BrowseItem } from '@/components/PokemonCard'
import PokemonCardSkeleton from '@/components/PokemonCardSkeleton'
import type { PokemonSummary } from '@/state/types'

type PokemonGridProps =
  | {
      variant?: 'browse'
      items: BrowseItem[]
      isLoading?: boolean
      skeletonCount?: number
    }
  | { variant: 'group'; groupId: string; members: PokemonSummary[] }

const GRID_CLASS =
  'grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6'

/** Responsive grid of PokemonCards for either the browse or a group context. */
function PokemonGrid(props: PokemonGridProps) {
  if (props.variant === 'group') {
    return (
      <div className={GRID_CLASS}>
        {props.members.map((m, i) => (
          <PokemonCard
            key={m.id}
            variant="group"
            groupId={props.groupId}
            summary={m}
            index={i}
          />
        ))}
      </div>
    )
  }

  const { items, isLoading = false, skeletonCount = 24 } = props

  if (isLoading) {
    return (
      <div className={GRID_CLASS}>
        {Array.from({ length: skeletonCount }, (_, i) => (
          <PokemonCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className={GRID_CLASS}>
      {items.map((item, i) => (
        <PokemonCard key={item.id} item={item} index={i} />
      ))}
    </div>
  )
}

export default PokemonGrid
