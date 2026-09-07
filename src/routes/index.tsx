import { createBrowserRouter } from 'react-router-dom'
import App from '@/App'
import BrowsePage from '@/routes/BrowsePage'
import CollectionPage from '@/routes/CollectionPage'
import GroupPage from '@/routes/GroupPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <BrowsePage /> },
      { path: 'collection', element: <CollectionPage /> },
      { path: 'collection/:groupId', element: <GroupPage /> },
    ],
  },
])
