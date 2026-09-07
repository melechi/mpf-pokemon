import { useAtomValue, useSetAtom } from 'jotai'
import { cn } from '@/lib/cn'
import { colorClass } from '@/state/colors'
import {
  addToGroupAtom,
  groupIdsContaining,
  orderedGroupsAtom,
  removeFromGroupAtom,
} from '@/state/collections'
import { userDataAtom } from '@/state/storage'
import { FAVOURITES_ID, type PokemonSummary } from '@/state/types'

type GroupPickerProps = {
  summary: PokemonSummary
  onClose?: () => void
  /** Which edge to anchor to, so the panel opens toward on-screen space. */
  align?: 'left' | 'right'
}

/**
 * Toggle a Pokémon's membership across the user's groups (Favourites excluded).
 * Reachable from a browse card once its detail (the summary) is available.
 */
function GroupPicker({ summary, onClose, align = 'left' }: GroupPickerProps) {
  const groups = useAtomValue(orderedGroupsAtom)
  const data = useAtomValue(userDataAtom)
  const addToGroup = useSetAtom(addToGroupAtom)
  const removeFromGroup = useSetAtom(removeFromGroupAtom)

  const memberOf = new Set(groupIdsContaining(data, summary.id))
  const pickable = groups.filter((g) => g.id !== FAVOURITES_ID)

  function toggle(groupId: string, isMember: boolean) {
    // addToGroupAtom stamps addedAt on add.
    if (isMember) removeFromGroup({ groupId, pokemonId: summary.id })
    else addToGroup({ groupId, summary })
  }

  return (
    <div
      className={cn(
        'absolute top-full z-20 mt-2 w-64 max-w-[calc(100vw-1.5rem)] rounded-[22px] border border-zinc-900/8 bg-white p-2 text-left shadow-[0_18px_34px_-18px_rgba(43,42,51,.5)]',
        align === 'right' ? 'right-0' : 'left-0',
      )}
    >
      <div className="mb-1 flex items-center justify-between px-2 pt-1">
        <span className="text-xs font-extrabold tracking-wide text-stone-500 uppercase">
          Add to group
        </span>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close group picker"
            className="text-stone-400 hover:text-stone-600"
          >
            ✕
          </button>
        )}
      </div>
      {pickable.length === 0 ? (
        <p className="px-2 py-2 text-sm font-semibold text-stone-400">
          No groups yet. Create one on the Collection page.
        </p>
      ) : (
        <ul className="max-h-56 overflow-y-auto">
          {pickable.map((group) => {
            const isMember = memberOf.has(group.id)
            return (
              <li key={group.id}>
                <label className="flex min-h-13 cursor-pointer items-center gap-3 rounded-2xl px-3 transition-colors hover:bg-stone-50">
                  <input
                    type="checkbox"
                    checked={isMember}
                    onChange={() => toggle(group.id, isMember)}
                    className="size-6.5 rounded-[9px] border-[3px] border-line accent-berry transition-transform checked:border-berry checked:bg-berry active:scale-90"
                  />
                  <span
                    aria-hidden="true"
                    className={cn(
                      'size-3.5 rounded-full',
                      colorClass(group.color),
                    )}
                  />
                  <b className="flex-1 truncate text-base font-bold text-ink">
                    {group.name}
                  </b>
                  <span className="text-sm font-extrabold text-stone-500">
                    {group.members.length}
                  </span>
                </label>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default GroupPicker
