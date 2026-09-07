import { useAtomValue } from 'jotai'
import CreateGroupForm from '@/components/CreateGroupForm'
import EmptyState from '@/components/EmptyState'
import GroupList from '@/components/GroupList'
import { orderedGroupsAtom } from '@/state/collections'
import { FAVOURITES_ID } from '@/state/types'

function CollectionPage() {
  const groups = useAtomValue(orderedGroupsAtom)
  const hasUserGroups = groups.some((g) => g.id !== FAVOURITES_ID)

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold text-slate-800">Collection</h1>
        <p className="text-sm text-slate-500">
          Favourites plus any groups you create.
        </p>
      </div>

      <CreateGroupForm />

      <GroupList />

      {!hasUserGroups && (
        <EmptyState
          title="No groups yet"
          description="Create a group above, then add Pokémon to it from the Browse page."
        />
      )}
    </div>
  )
}

export default CollectionPage
