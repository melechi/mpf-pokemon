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
        className="min-h-11 rounded-full border-2 border-line bg-white px-4 text-sm font-extrabold text-stone-600 transition hover:border-stone-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-berry/35"
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
          'min-h-11 rounded-2xl border-2 px-3 text-base font-semibold outline-none focus-visible:border-berry focus-visible:ring-4 focus-visible:ring-berry/20',
          error ? 'border-red-500' : 'border-line',
        )}
      />
      <button
        type="submit"
        className="min-h-11 rounded-2xl bg-berry px-4 text-sm font-extrabold text-white shadow-[0_3px_0_#A62622] transition active:translate-y-[3px] active:shadow-none"
      >
        Save
      </button>
      <button
        type="button"
        onClick={() => setEditing(false)}
        className="min-h-11 rounded-2xl border-2 border-line px-4 text-sm font-extrabold text-stone-600"
      >
        Cancel
      </button>
      {error && (
        <span role="alert" className="text-sm font-bold text-red-700">
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
      <div className="mx-auto max-w-6xl px-4 py-5">
        <EmptyState
          variant="no-results"
          title="Group not found"
          description="This group doesn't exist. It may have been deleted."
          action={
            <Link
              to="/collection"
              className="min-h-12 rounded-2xl bg-berry px-6 py-3 font-extrabold text-white shadow-[0_3px_0_#A62622]"
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
    <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-5">
      <div className="flex flex-col gap-3">
        <Link
          to="/collection"
          className="inline-flex min-h-11 items-center gap-2 self-start text-sm font-extrabold text-berry-ink hover:text-berry"
        >
          ← All collections
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <span
            aria-hidden="true"
            className={cn('size-5 rounded-full', colorClass(group.color))}
          />
          <h1 className="font-display text-3xl font-extrabold text-ink">
            {isFavourites ? 'Favourites' : group.name}
          </h1>
          <span
            className={cn(
              'rounded-full px-3 py-1 text-xs font-extrabold',
              isFavourites
                ? 'bg-amber-400 text-amber-950'
                : 'bg-stone-100 text-stone-600',
            )}
          >
            {group.members.length} Pokémon
          </span>
          {/* Rename is hidden for Favourites. */}
          {!isFavourites && (
            <RenameControl groupId={group.id} name={group.name} />
          )}
        </div>
      </div>

      {group.members.length === 0 ? (
        <EmptyState
          variant="empty"
          title="This group is empty"
          description={
            isFavourites
              ? 'Star some Pokémon on the Browse page to add them here.'
              : 'Head to Browse and tap “+ Add to group”.'
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
