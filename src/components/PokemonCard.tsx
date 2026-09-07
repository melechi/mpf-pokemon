import { useState } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { usePokemonDetail } from '@/queries/usePokemonDetail'
import {
  favouritesAtom,
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
  | { variant?: 'browse'; item: BrowseItem }
  | { variant: 'group'; groupId: string; summary: PokemonSummary }

/**
 * A Pokémon card whose behaviour depends on context:
 * - browse: runs its own detail query, stars, and assigns to groups.
 * - group:  renders from a stored summary (no network) and offers removal.
 *
 * The detail hook is always called (disabled in the group context via an
 * undefined id) so hook order stays stable.
 */
function PokemonCard(props: PokemonCardProps) {
  const isGroup = props.variant === 'group'
  const browseId = props.variant === 'group' ? undefined : props.item.id
  const { data: detail, isLoading } = usePokemonDetail(browseId)

  const favourites = useAtomValue(favouritesAtom)
  const toggleFavourite = useSetAtom(toggleFavouriteAtom)
  const removeFromGroup = useSetAtom(removeFromGroupAtom)

  const [pickerOpen, setPickerOpen] = useState(false)

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

  const isFavourite = favourites.members.some((m) => m.id === id)
  // Placeholder addedAt (0); GroupPicker stamps the real timestamp on add.
  const summary: PokemonSummary | null =
    props.variant === 'group'
      ? props.summary
      : detail
        ? toSummary(detail, 0)
        : null

  return (
    <div className="relative flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex w-full items-start justify-between">
        <span className="font-mono text-xs text-slate-400">
          #{String(id).padStart(3, '0')}
        </span>
        {props.variant === 'group' ? (
          <button
            type="button"
            onClick={() =>
              removeFromGroup({ groupId: props.groupId, pokemonId: id })
            }
            aria-label={`Remove ${name} from this group`}
            title={`Remove ${name} from this group`}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 6h18M8 6V4h8v2m-9 0v14a1 1 0 001 1h8a1 1 0 001-1V6M10 11v6M14 11v6" />
            </svg>
          </button>
        ) : (
          <StarButton
            active={isFavourite}
            disabled={!detail}
            onToggle={() =>
              detail && toggleFavourite(toSummary(detail, Date.now()))
            }
          />
        )}
      </div>

      {spriteUrl ? (
        <img
          src={spriteUrl}
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
        {types.map((t) => (
          <TypePill key={t} type={t} />
        ))}
      </div>

      {props.variant !== 'group' && (
        <div className="relative w-full">
          <button
            type="button"
            disabled={!summary}
            aria-expanded={pickerOpen}
            onClick={() => setPickerOpen((o) => !o)}
            className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            + Add to group
          </button>
          {pickerOpen && summary && (
            <GroupPicker
              summary={summary}
              onClose={() => setPickerOpen(false)}
            />
          )}
        </div>
      )}
    </div>
  )
}

export default PokemonCard
