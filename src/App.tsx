import { Link, Outlet } from 'react-router-dom'

// Phase 1 scaffold: minimal layout so placeholder routes are navigable.
// Real app shell / nav / styling come in later phases.
function App() {
  return (
    <div>
      <nav>
        <Link to="/">Browse</Link>
        {' | '}
        <Link to="/collection">Collection</Link>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default App
