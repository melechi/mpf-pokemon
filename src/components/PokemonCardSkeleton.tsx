// Loading placeholder that matches PokemonCard's dimensions (8px strip, h-23
// sprite box, 44px button) so the grid does not reflow when real cards arrive.
function PokemonCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="relative flex flex-col gap-2.5 overflow-hidden rounded-2xl border border-zinc-900/5 bg-white px-3 pt-4 pb-3.5 shadow-[0_2px_0_rgba(43,42,51,.06)]"
    >
      <div className="pointer-events-none absolute inset-0 shimmer" />
      <div className="absolute inset-x-0 top-0 h-2 bg-stone-200" />
      <div className="h-23 rounded-[18px] bg-stone-100" />
      <div className="h-3 w-2/5 rounded bg-stone-100" />
      <div className="h-4 w-3/4 rounded bg-stone-200" />
      <div className="flex gap-1.5">
        <span className="h-5 w-14 rounded-full bg-stone-100" />
        <span className="h-5 w-10 rounded-full bg-stone-50" />
      </div>
      <div className="h-11 rounded-2xl bg-amber-50" />
    </div>
  )
}

export default PokemonCardSkeleton
