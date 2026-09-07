import { useState } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/cn'
import { colorClass } from '@/state/colors'
import { deleteGroupAtom, orderedGroupsAtom } from '@/state/collections'
import { FAVOURITES_ID, type Group } from '@/state/types'

const PREVIEW_COUNT = 4

function PreviewSprites({ group }: { group: Group }) {
  const preview = group.members.slice(0, PREVIEW_COUNT)
  const overflow = group.members.length - preview.length
  if (group.members.length === 0) {
    return (
      <span className="text-sm font-semibold text-stone-400">
        No Pokémon yet
      </span>
    )
  }
  return (
    <>
      {preview.map((m) =>
        m.spriteUrl ? (
          <img
            key={m.id}
            src={m.spriteUrl}
            alt={m.name}
            width={48}
            height={48}
            loading="lazy"
            className="size-12 rounded-2xl bg-stone-50 object-contain shadow-[inset_0_0_0_1px_rgba(43,42,51,.06)]"
          />
        ) : (
          <span
            key={m.id}
            className="grid size-12 place-items-center rounded-2xl bg-stone-100 text-stone-300"
          >
            ?
          </span>
        ),
      )}
      {overflow > 0 && (
        <span className="grid size-12 place-items-center rounded-2xl bg-stone-100 text-sm font-extrabold text-stone-500">
          +{overflow}
        </span>
      )}
    </>
  )
}

function GroupCard({ group }: { group: Group }) {
  const deleteGroup = useSetAtom(deleteGroupAtom)
  const [confirming, setConfirming] = useState(false)
  const isFavourites = group.id === FAVOURITES_ID

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-3xl p-4 transition',
        isFavourites
          ? 'border-2 border-amber-400 bg-gradient-to-b from-amber-50 to-amber-100 shadow-[0_3px_0_#E8A81C,0_14px_26px_-16px_rgba(180,120,10,.6)]'
          : 'border border-zinc-900/5 bg-white shadow-[0_2px_0_rgba(43,42,51,.06)] hover:-translate-y-1 hover:shadow-[0_16px_28px_-16px_rgba(43,42,51,.45)]',
      )}
    >
      {!isFavourites && (
        <span
          aria-hidden="true"
          className={cn(
            'absolute inset-y-0 left-0 w-2',
            colorClass(group.color),
          )}
        />
      )}

      {/* Delete affordance — hidden entirely for Favourites. */}
      {!isFavourites && (
        <button
          type="button"
          onClick={() => setConfirming((c) => !c)}
          aria-label={`Delete group ${group.name}`}
          aria-expanded={confirming}
          className="absolute top-3 right-3 z-10 grid size-11 place-items-center rounded-full bg-red-50 text-lg font-extrabold text-red-700 transition hover:bg-red-100 active:scale-90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-berry/35"
        >
          ✕
        </button>
      )}

      <Link
        to={`/collection/${group.id}`}
        className="flex flex-col gap-3 rounded-2xl pl-2 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-berry/35"
      >
        <div className="flex items-center gap-2.5 pr-14">
          <span
            aria-hidden="true"
            className={cn(
              'size-4 rounded-full animate-[cc-wiggle_.3s_ease-out_both]',
              colorClass(group.color),
            )}
          />
          <b
            className={cn(
              'flex-1 truncate font-display text-xl font-extrabold',
              isFavourites ? 'text-amber-900' : 'text-ink',
            )}
          >
            {isFavourites ? 'Favourites' : group.name}
          </b>
          <span
            className={cn(
              'rounded-full px-3 py-1 text-xs font-extrabold',
              isFavourites
                ? 'bg-amber-400 text-amber-950'
                : 'bg-stone-100 text-stone-600',
            )}
          >
            {isFavourites
              ? `${group.members.length} Pokémon`
              : group.members.length}
          </span>
        </div>
        <div className="flex gap-2 pl-1">
          <PreviewSprites group={group} />
        </div>
      </Link>

      {/* Confirm expands in place (grid-rows + opacity, 200ms). */}
      <div
        className={cn(
          'grid transition-all duration-200',
          confirming
            ? 'mt-3 grid-rows-[1fr] opacity-100'
            : 'grid-rows-[0fr] opacity-0',
        )}
      >
        <div className="overflow-hidden">
          <div role="alert" className="flex flex-col gap-2.5 pl-2">
            <span className="text-sm font-bold text-red-800">
              Delete this group? The Pokémon stay in your collection.
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => deleteGroup(group.id)}
                className="min-h-11 flex-1 rounded-2xl bg-berry font-extrabold text-white shadow-[0_3px_0_#8C2F27] transition active:translate-y-[3px] active:shadow-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-berry/35"
              >
                Yes, delete
              </button>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="min-h-11 flex-1 rounded-2xl border-2 border-line bg-white font-extrabold text-stone-600 transition hover:border-stone-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-berry/35"
              >
                Keep it
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/** Grid of group cards: Favourites first and highlighted, then the rest in order. */
function GroupList() {
  const groups = useAtomValue(orderedGroupsAtom)
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {groups.map((group) => (
        <GroupCard key={group.id} group={group} />
      ))}
    </div>
  )
}

export default GroupList
