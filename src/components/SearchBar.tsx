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
      <input
        id="pokemon-search"
        type="search"
        inputMode="search"
        autoComplete="off"
        placeholder="Search Pokémon by name…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-800 shadow-sm placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
      />
    </form>
  )
}

export default SearchBar
