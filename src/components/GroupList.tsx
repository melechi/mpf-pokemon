import { useState } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/cn'
import { colorClass } from '@/state/colors'
import { deleteGroupAtom, orderedGroupsAtom } from '@/state/collections'
import { FAVOURITES_ID, type Group } from '@/state/types'

const PREVIEW_COUNT = 4

function GroupCard({ group }: { group: Group }) {
  const deleteGroup = useSetAtom(deleteGroupAtom)
  const [confirming, setConfirming] = useState(false)
  const isFavourites = group.id === FAVOURITES_ID
  const preview = group.members.slice(0, PREVIEW_COUNT)

  return (
    <div
      className={cn(
        'relative flex flex-col gap-3 rounded-xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md',
        isFavourites
          ? 'border-amber-300 ring-1 ring-amber-200'
          : 'border-slate-200',
      )}
    >
      {/* Delete affordance — hidden entirely for Favourites. */}
      {!isFavourites &&
        (confirming ? (
          <div className="absolute right-2 top-2 flex items-center gap-1">
            <button
              type="button"
              onClick={() => deleteGroup(group.id)}
              className="rounded bg-red-500 px-2 py-1 text-xs font-semibold text-white hover:bg-red-600"
            >
              Delete
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            aria-label={`Delete group ${group.name}`}
            className="absolute right-2 top-2 rounded px-2 py-1 text-xs text-slate-400 hover:bg-red-50 hover:text-red-500"
          >
            Delete
          </button>
        ))}

      <Link to={`/collection/${group.id}`} className="flex flex-col gap-3">
        <div className="flex items-center gap-2 pr-16">
          <span
            className={cn(
              'inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize',
              colorClass(group.color),
            )}
          >
            {isFavourites ? '★ Favourites' : group.name}
          </span>
          <span className="text-xs text-slate-400">
            {group.members.length} Pokémon
          </span>
        </div>

        <div className="flex gap-2">
          {preview.length === 0 ? (
            <span className="text-xs text-slate-400">No members yet</span>
          ) : (
            preview.map((m) =>
              m.spriteUrl ? (
                <img
                  key={m.id}
                  src={m.spriteUrl}
                  alt={m.name}
                  width={40}
                  height={40}
                  loading="lazy"
                  className="h-10 w-10 object-contain"
                />
              ) : (
                <div
                  key={m.id}
                  className="flex h-10 w-10 items-center justify-center text-slate-300"
                >
                  ?
                </div>
              ),
            )
          )}
          {group.members.length > PREVIEW_COUNT && (
            <span className="self-center text-xs text-slate-400">
              +{group.members.length - PREVIEW_COUNT}
            </span>
          )}
        </div>
      </Link>
    </div>
  )
}

/** Grid of group preview cards: Favourites first and highlighted, then the rest in order. */
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
