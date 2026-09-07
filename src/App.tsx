import { Link, NavLink, Outlet } from 'react-router-dom'
import { cn } from '@/lib/cn'

const navClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
    isActive
      ? 'bg-amber-100 text-amber-800'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
  )

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="text-lg font-bold tracking-tight">
            <span className="text-amber-500">Poké</span>Browser
          </Link>
          <nav className="flex items-center gap-1">
            <NavLink to="/" end className={navClass}>
              Browse
            </NavLink>
            <NavLink to="/collection" className={navClass}>
              Collection
            </NavLink>
          </nav>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default App
