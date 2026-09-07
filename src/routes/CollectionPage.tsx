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
    <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-5">
      <h1 className="font-display text-3xl font-extrabold text-ink">
        My collections
      </h1>

      <CreateGroupForm />

      <GroupList />

      {!hasUserGroups && (
        <EmptyState
          variant="no-groups"
          title="No groups yet"
          description="Name a team above and start sorting your Pokémon."
        />
      )}
    </div>
  )
}

export default CollectionPage
