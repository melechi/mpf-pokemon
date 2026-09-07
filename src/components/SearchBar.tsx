import { useEffect, useState } from 'react'

type SearchBarProps = {
  query: string
  onQueryChange: (query: string) => void
  debounceMs?: number
}

/** Search input for the `q` param. Debounces typing before reporting changes. */
function SearchBar({ query, onQueryChange, debounceMs = 300 }: SearchBarProps) {
  const [value, setValue] = useState(query)
  const [syncedQuery, setSyncedQuery] = useState(query)

  // Adjust the input when the query changes externally (e.g. back/forward).
  // Done during render (not in an effect) per the React "adjusting state on
  // prop change" pattern, so there is no cascading-render setState-in-effect.
  if (query !== syncedQuery) {
    setSyncedQuery(query)
    setValue(query)
  }

  // Debounce: report the typed value after a pause, unless it already matches.
  useEffect(() => {
    if (value === query) return
    const handle = setTimeout(() => onQueryChange(value), debounceMs)
    return () => clearTimeout(handle)
  }, [value, query, debounceMs, onQueryChange])

  return (
    <form role="search" className="w-full" onSubmit={(e) => e.preventDefault()}>
      <label htmlFor="pokemon-search" className="sr-only">
        Search Pokémon by name
      </label>
      <div className="relative">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 rounded-full border-[3px] border-stone-400"
        />
        <input
          id="pokemon-search"
          type="search"
          inputMode="search"
          autoComplete="off"
          placeholder="Search Pokémon…"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="min-h-12 w-full rounded-full border-2 border-line bg-white pr-5 pl-11 text-base font-semibold text-ink shadow-[0_2px_0_rgba(43,42,51,.05)] outline-none placeholder:font-semibold placeholder:text-stone-500 focus-visible:border-berry focus-visible:ring-4 focus-visible:ring-berry/20"
        />
      </div>
    </form>
  )
}

export default SearchBar
