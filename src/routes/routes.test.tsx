import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
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
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )
}

beforeEach(() => {
  // Keep the index query pending so BrowsePage renders its loading state — no
  // real network calls in tests.
  vi.stubGlobal(
    'fetch',
    vi.fn(() => new Promise<Response>(() => {})),
  )
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('routes', () => {
  it('renders the browse page (search) at /', () => {
    renderAt('/')
    expect(screen.getByRole('searchbox')).toBeInTheDocument()
  })

  it('renders the collection page at /collection', () => {
    renderAt('/collection')
    expect(
      screen.getByRole('heading', { name: /Collection/i }),
    ).toBeInTheDocument()
  })

  it('renders a known group at /collection/:groupId', () => {
    renderAt('/collection/favourites')
    expect(screen.getByText(/Favourites/i)).toBeInTheDocument()
  })

  it('renders a not-found state for an unknown group id', () => {
    renderAt('/collection/does-not-exist')
    expect(screen.getByText(/Group not found/i)).toBeInTheDocument()
  })
})
