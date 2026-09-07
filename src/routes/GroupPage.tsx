import { useParams } from 'react-router-dom'

function GroupPage() {
  const { groupId } = useParams()
  return <h1>Group {groupId} (placeholder)</h1>
}

export default GroupPage
