// Loading placeholder that matches PokemonCard's dimensions so the grid does
// not reflow when real cards arrive. Cheap CSS, no external library.
function PokemonCardSkeleton() {
  return (
    <div
      className="flex flex-col items-center gap-3 rounded-xl border border-slate-200 bg-white p-4"
      aria-hidden="true"
    >
      <div className="h-24 w-24 animate-pulse rounded-full bg-slate-200" />
      <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
      <div className="flex gap-2">
        <div className="h-5 w-12 animate-pulse rounded-full bg-slate-200" />
        <div className="h-5 w-12 animate-pulse rounded-full bg-slate-200" />
      </div>
    </div>
  )
}

export default PokemonCardSkeleton
