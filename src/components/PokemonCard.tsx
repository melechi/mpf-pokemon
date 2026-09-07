import { useAtomValue, useSetAtom } from 'jotai'
import { usePokemonDetail } from '@/queries/usePokemonDetail'
import { favouritesAtom, toggleFavouriteAtom } from '@/state/collections'
import { toSummary } from '@/state/summary'
import PokemonCardSkeleton from '@/components/PokemonCardSkeleton'
import StarButton from '@/components/StarButton'
import TypePill from '@/components/TypePill'

export type BrowseItem = { id: number; name: string }

/**
 * A single Pokémon card. Runs its own detail query (so detail loads only for
 * visible cards) and shows a skeleton until that detail arrives. Starring
 * requires the summary, which needs detail — so the star is disabled until then.
 */
function PokemonCard({ item }: { item: BrowseItem }) {
  const { data: detail, isLoading } = usePokemonDetail(item.id)
  const favourites = useAtomValue(favouritesAtom)
  const toggleFavourite = useSetAtom(toggleFavouriteAtom)

  if (isLoading) return <PokemonCardSkeleton />

  const isFavourite = favourites.members.some((m) => m.id === item.id)
  const name = detail?.name ?? item.name

  function handleToggle() {
    if (!detail) return
    toggleFavourite(toSummary(detail, Date.now()))
  }

  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex w-full items-start justify-between">
        <span className="text-xs font-mono text-slate-400">
          #{String(item.id).padStart(3, '0')}
        </span>
        <StarButton
          active={isFavourite}
          disabled={!detail}
          onToggle={handleToggle}
        />
      </div>

      {detail?.spriteUrl ? (
        <img
          src={detail.spriteUrl}
          alt={name}
          width={96}
          height={96}
          loading="lazy"
          className="h-24 w-24 object-contain"
        />
      ) : (
        <div className="flex h-24 w-24 items-center justify-center text-slate-300">
          ?
        </div>
      )}

      <h3 className="text-base font-semibold capitalize text-slate-800">
        {name}
      </h3>

      <div className="flex flex-wrap justify-center gap-1.5">
        {detail?.types.map((t) => (
          <TypePill key={t} type={t} />
        ))}
      </div>
    </div>
  )
}

export default PokemonCard
