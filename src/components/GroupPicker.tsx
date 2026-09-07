import { useAtomValue, useSetAtom } from 'jotai'
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
}

/**
 * Toggle a Pokémon's membership across the user's groups (Favourites excluded).
 * Reachable from a browse card once its detail (the summary) is available.
 */
function GroupPicker({ summary, onClose }: GroupPickerProps) {
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
    <div className="absolute left-0 right-0 top-full z-20 mt-1 rounded-lg border border-slate-200 bg-white p-2 text-left shadow-lg">
      <div className="mb-1 flex items-center justify-between px-1">
        <span className="text-xs font-semibold text-slate-500">
          Add to group
        </span>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close group picker"
            className="text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        )}
      </div>
      {pickable.length === 0 ? (
        <p className="px-1 py-1.5 text-xs text-slate-400">
          No groups yet. Create one on the Collection page.
        </p>
      ) : (
        <ul className="max-h-48 overflow-y-auto">
          {pickable.map((group) => {
            const isMember = memberOf.has(group.id)
            return (
              <li key={group.id}>
                <label className="flex cursor-pointer items-center gap-2 rounded px-1 py-1.5 text-sm hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={isMember}
                    onChange={() => toggle(group.id, isMember)}
                    className="h-4 w-4 accent-amber-500"
                  />
                  <span className="truncate text-slate-700">{group.name}</span>
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
