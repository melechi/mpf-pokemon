import { Link, NavLink, Outlet } from 'react-router-dom'
import { cn } from '@/lib/cn'

const navClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'flex-1 rounded-full py-2.5 text-center text-[15px] transition-colors',
    'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40',
    isActive
      ? 'bg-surface font-extrabold text-berry-ink shadow-[0_2px_0_rgba(0,0,0,.12)]'
      : 'font-bold text-white/85 hover:text-white',
  )

function App() {
  return (
    <div className="min-h-dvh bg-paper font-sans text-ink antialiased">
      <header className="sticky top-0 z-10 bg-berry px-4 pt-3.5 pb-4 shadow-[0_3px_0_#A62622]">
        <div className="mx-auto flex max-w-6xl flex-col gap-3.5">
          <Link
            to="/"
            className="flex items-center gap-2.5 self-start rounded-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
          >
            <span className="size-5 rounded-full bg-amber-400 ring-4 ring-white/30" />
            <span className="font-display text-[22px] font-extrabold tracking-tight text-[#FFFDF7]">
              PokéBrowser
            </span>
          </Link>
          <nav className="flex gap-2 rounded-full bg-black/15 p-1.5">
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
