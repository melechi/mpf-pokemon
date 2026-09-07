import { useAtomValue, useSetAtom } from 'jotai'
import { usePokemonDetail } from '@/queries/usePokemonDetail'
import { cn } from '@/lib/cn'
import { typePad, typeStrip } from '@/state/colors'
import {
  favouritesAtom,
  openPickerIdAtom,
  removeFromGroupAtom,
  toggleFavouriteAtom,
} from '@/state/collections'
import { toSummary } from '@/state/summary'
import type { PokemonSummary } from '@/state/types'
import GroupPicker from '@/components/GroupPicker'
import PokemonCardSkeleton from '@/components/PokemonCardSkeleton'
import StarButton from '@/components/StarButton'
import TypePill from '@/components/TypePill'

export type BrowseItem = { id: number; name: string }

type PokemonCardProps =
  | { variant?: 'browse'; item: BrowseItem; index?: number }
  | {
      variant: 'group'
      groupId: string
      summary: PokemonSummary
      index?: number
    }

const CARD_SHELL =
  'relative flex flex-col gap-2.5 rounded-2xl border border-zinc-900/5 bg-white px-3 pt-4 pb-3.5 ' +
  'shadow-[0_2px_0_rgba(43,42,51,.06),0_10px_20px_-12px_rgba(43,42,51,.4)] ' +
  'transition duration-200 hover:-translate-y-1.5 hover:scale-[1.02] active:scale-[.98] ' +
  'animate-[cc-in_.32s_cubic-bezier(.2,.9,.3,1.2)_both]'

/**
 * A Pokémon card whose behaviour depends on context:
 * - browse: runs its own detail query, stars, and assigns to groups.
 * - group:  renders from a stored summary (no network) and offers removal.
 */
function PokemonCard(props: PokemonCardProps) {
  const isGroup = props.variant === 'group'
  const browseId = props.variant === 'group' ? undefined : props.item.id
  const { data: detail, isLoading } = usePokemonDetail(browseId)

  const favourites = useAtomValue(favouritesAtom)
  const toggleFavourite = useSetAtom(toggleFavouriteAtom)
  const removeFromGroup = useSetAtom(removeFromGroupAtom)
  const openPickerId = useAtomValue(openPickerIdAtom)
  const setOpenPickerId = useSetAtom(openPickerIdAtom)

  if (!isGroup && isLoading) return <PokemonCardSkeleton />

  const id = props.variant === 'group' ? props.summary.id : props.item.id
  const name =
    props.variant === 'group'
      ? props.summary.name
      : (detail?.name ?? props.item.name)
  const types =
    props.variant === 'group' ? props.summary.types : (detail?.types ?? [])
  const spriteUrl =
    props.variant === 'group'
      ? props.summary.spriteUrl
      : (detail?.spriteUrl ?? null)
  const primaryType = types[0]

  const isFavourite = favourites.members.some((m) => m.id === id)
  // Placeholder addedAt (0); GroupPicker stamps the real timestamp on add.
  const summary: PokemonSummary | null =
    props.variant === 'group'
      ? props.summary
      : detail
        ? toSummary(detail, 0)
        : null

  const pickerOpen = props.variant !== 'group' && openPickerId === id
  const delay = `${(props.index ?? 0) * 45}ms`

  return (
    <div
      // Lift above sibling cards while the picker dropdown is open — the card's
      // hover transform makes it a stacking context, so the picker's own
      // z-index alone can't escape it.
      className={cn(CARD_SHELL, pickerOpen && 'z-30')}
      style={{ animationDelay: delay }}
    >
      <div
        className={cn(
          'absolute inset-x-0 top-0 h-2 rounded-t-2xl',
          typeStrip(primaryType),
        )}
      />

      {props.variant === 'group' ? (
        <button
          type="button"
          onClick={() =>
            removeFromGroup({ groupId: props.groupId, pokemonId: id })
          }
          aria-label={`Remove ${name} from this group`}
          title={`Remove ${name} from this group`}
          className="absolute right-2.5 top-3 z-10 grid size-11 place-items-center rounded-full bg-red-50 text-lg font-extrabold text-red-700 shadow-[0_2px_6px_rgba(43,42,51,.16)] transition hover:bg-red-100 active:scale-90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-berry/35"
        >
          ✕
        </button>
      ) : (
        <span className="absolute right-2.5 top-3 z-10">
          <StarButton
            active={isFavourite}
            disabled={!detail}
            onToggle={() =>
              detail && toggleFavourite(toSummary(detail, Date.now()))
            }
          />
        </span>
      )}

      <div
        className={cn(
          'mt-1.5 flex h-23 items-end justify-center rounded-[18px] pb-1.5',
          typePad(primaryType),
        )}
      >
        {spriteUrl ? (
          <img
            src={spriteUrl}
            alt={name}
            width={64}
            height={64}
            loading="lazy"
            className="size-16 object-contain"
          />
        ) : (
          <div className="flex size-16 items-center justify-center text-stone-300">
            ?
          </div>
        )}
      </div>

      <div className="flex flex-col gap-0.5">
        <code className="font-mono text-xs font-bold text-stone-500">
          #{String(id).padStart(3, '0')}
        </code>
        <b className="font-display text-lg font-bold capitalize leading-tight text-ink">
          {name}
        </b>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {types.map((t) => (
          <TypePill key={t} type={t} />
        ))}
      </div>

      {props.variant !== 'group' && (
        <div className="relative">
          <button
            type="button"
            disabled={!summary}
            aria-expanded={pickerOpen}
            onClick={() => setOpenPickerId(pickerOpen ? null : id)}
            className="min-h-11 w-full rounded-2xl bg-amber-100 text-sm font-extrabold text-amber-800 transition hover:bg-amber-200 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-berry/35 disabled:cursor-not-allowed disabled:opacity-40"
          >
            + Add to group
          </button>
          {pickerOpen && summary && (
            <GroupPicker
              summary={summary}
              align={(props.index ?? 0) % 2 === 0 ? 'left' : 'right'}
              onClose={() => setOpenPickerId(null)}
            />
          )}
        </div>
      )}
    </div>
  )
}

export default PokemonCard
