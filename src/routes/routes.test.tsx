import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import App from '@/App'
import BrowsePage from '@/routes/BrowsePage'
import CollectionPage from '@/routes/CollectionPage'
import GroupPage from '@/routes/GroupPage'

const routes = [
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <BrowsePage /> },
      { path: 'collection', element: <CollectionPage /> },
      { path: 'collection/:groupId', element: <GroupPage /> },
    ],
  },
]

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  return render(<RouterProvider router={router} />)
}

describe('routes', () => {
  it('renders the browse placeholder at /', () => {
    renderAt('/')
    expect(screen.getByText(/Browse \(placeholder\)/i)).toBeInTheDocument()
  })

  it('renders the collection placeholder at /collection', () => {
    renderAt('/collection')
    expect(screen.getByText(/Collection \(placeholder\)/i)).toBeInTheDocument()
  })

  it('renders the group placeholder at /collection/:groupId', () => {
    renderAt('/collection/favourites')
    expect(
      screen.getByText(/Group favourites \(placeholder\)/i),
    ).toBeInTheDocument()
  })
})
