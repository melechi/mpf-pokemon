// Pure, client-side search + pagination helpers over the Pokémon index.
// No React, no fetching.

export const PAGE_SIZE = 24

/**
 * Case-insensitive substring match on `name`. Empty or whitespace-only queries
 * return the full list. No sorting, no fuzzy matching.
 */
export function filterPokemon<T extends { name: string }>(
  items: readonly T[],
  query: string,
): T[] {
  const q = query.trim().toLowerCase()
  if (q === '') return [...items]
  return items.filter((item) => item.name.toLowerCase().includes(q))
}

/**
 * Return the slice of `items` for a 1-based `page`. Out-of-range pages (and
 * pages < 1) return an empty array.
 */
export function paginate<T>(
  items: readonly T[],
  page: number,
  pageSize: number = PAGE_SIZE,
): T[] {
  if (page < 1) return []
  const start = (page - 1) * pageSize
  return items.slice(start, start + pageSize)
}

/** Number of pages for `total` items — always at least 1. */
export function pageCount(total: number, pageSize: number = PAGE_SIZE): number {
  return Math.max(1, Math.ceil(total / pageSize))
}
