import { useState } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { Link, useParams } from 'react-router-dom'
import { cn } from '@/lib/cn'
import EmptyState from '@/components/EmptyState'
import PokemonGrid from '@/components/PokemonGrid'
import { colorClass } from '@/state/colors'
import { renameGroupAtom } from '@/state/collections'
import { userDataAtom } from '@/state/storage'
import { FAVOURITES_ID } from '@/state/types'

function RenameControl({ groupId, name }: { groupId: string; name: string }) {
  const renameGroup = useSetAtom(renameGroupAtom)
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(name)
  const [error, setError] = useState<string | null>(null)

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => {
          setValue(name)
          setError(null)
          setEditing(true)
        }}
        className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-600 hover:bg-slate-50"
      >
        Rename
      </button>
    )
  }

  function save(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = value.trim()
    if (trimmed === '') {
      setError('Please enter a name.')
      return
    }
    renameGroup({ groupId, name: trimmed })
    setEditing(false)
  }

  return (
    <form onSubmit={save} className="flex items-center gap-2" noValidate>
      <input
        aria-label="Group name"
        aria-invalid={error !== null}
        value={value}
        onChange={(e) => {
          setValue(e.target.value)
          if (error) setError(null)
        }}
        className={cn(
          'rounded border px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40',
          error ? 'border-red-400' : 'border-slate-300',
        )}
      />
      <button
        type="submit"
        className="rounded bg-amber-500 px-2 py-1 text-xs font-semibold text-white hover:bg-amber-600"
      >
        Save
      </button>
      <button
        type="button"
        onClick={() => setEditing(false)}
        className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-600 hover:bg-slate-50"
      >
        Cancel
      </button>
      {error && (
        <span role="alert" className="text-xs text-red-600">
          {error}
        </span>
      )}
    </form>
  )
}

function GroupPage() {
  const { groupId } = useParams()
  const data = useAtomValue(userDataAtom)
  const group = groupId ? data.groups[groupId] : undefined

  if (!group) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-6">
        <EmptyState
          title="Group not found"
          description="This group doesn't exist. It may have been deleted."
          action={
            <Link
              to="/collection"
              className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600"
            >
              Back to Collection
            </Link>
          }
        />
      </div>
    )
  }

  const isFavourites = group.id === FAVOURITES_ID

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6">
      <div className="flex flex-col gap-3">
        <Link
          to="/collection"
          className="text-sm text-slate-500 hover:underline"
        >
          ← Collection
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span
              className={cn(
                'inline-block rounded-full px-3 py-1 text-sm font-semibold capitalize',
                colorClass(group.color),
              )}
            >
              {isFavourites ? '★ Favourites' : group.name}
            </span>
            <span className="text-sm text-slate-400">
              {group.members.length} Pokémon
            </span>
          </div>
          {/* Rename is hidden for Favourites. */}
          {!isFavourites && (
            <RenameControl groupId={group.id} name={group.name} />
          )}
        </div>
      </div>

      {group.members.length === 0 ? (
        <EmptyState
          title="No Pokémon here yet"
          description={
            isFavourites
              ? 'Star some Pokémon on the Browse page to add them here.'
              : 'Add Pokémon to this group from the Browse page.'
          }
        />
      ) : (
        <PokemonGrid
          variant="group"
          groupId={group.id}
          members={group.members}
        />
      )}
    </div>
  )
}

export default GroupPage
