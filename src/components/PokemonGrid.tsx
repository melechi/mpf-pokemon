import PokemonCard, { type BrowseItem } from '@/components/PokemonCard'
import PokemonCardSkeleton from '@/components/PokemonCardSkeleton'

type PokemonGridProps = {
  items: BrowseItem[]
  isLoading?: boolean
  skeletonCount?: number
}

const GRID_CLASS =
  'grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'

/** Responsive grid of PokemonCards, or a grid of skeletons while loading. */
function PokemonGrid({
  items,
  isLoading = false,
  skeletonCount = 24,
}: PokemonGridProps) {
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
      {items.map((item) => (
        <PokemonCard key={item.id} item={item} />
      ))}
    </div>
  )
}

export default PokemonGrid
