import { describe, expect, it } from 'vitest'
import { filterPokemon, pageCount, paginate, PAGE_SIZE } from '@/api/search'

const list = [
  { id: 1, name: 'bulbasaur' },
  { id: 4, name: 'charmander' },
  { id: 6, name: 'charizard' },
  { id: 25, name: 'pikachu' },
  { id: 143, name: 'snorlax' },
]

describe('filterPokemon', () => {
  it('matches mid-string, not just prefix', () => {
    // "iza" appears mid-word in "charizard"
    expect(filterPokemon(list, 'iza').map((p) => p.name)).toEqual(['charizard'])
    // "chu" is a suffix of "pikachu"
    expect(filterPokemon(list, 'chu').map((p) => p.name)).toEqual(['pikachu'])
  })

  it('is case-insensitive in both directions', () => {
    expect(filterPokemon(list, 'PIKA').map((p) => p.name)).toEqual(['pikachu'])
    const upper = [{ id: 1, name: 'BULBASAUR' }]
    expect(filterPokemon(upper, 'bulba').map((p) => p.name)).toEqual([
      'BULBASAUR',
    ])
  })

  it('returns the full list for empty and whitespace-only queries', () => {
    expect(filterPokemon(list, '')).toHaveLength(list.length)
    expect(filterPokemon(list, '   ')).toHaveLength(list.length)
  })

  it('returns an empty array when nothing matches', () => {
    expect(filterPokemon(list, 'zzz')).toEqual([])
  })
})

describe('paginate', () => {
  const items = Array.from({ length: 30 }, (_, i) => i + 1)

  it('returns the correct slice for pages 1 and 2', () => {
    expect(paginate(items, 1, 10)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    expect(paginate(items, 2, 10)).toEqual([
      11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    ])
  })

  it('returns an empty array past the end', () => {
    expect(paginate(items, 99, 10)).toEqual([])
  })

  it('returns an empty array for pages below 1', () => {
    expect(paginate(items, 0, 10)).toEqual([])
  })

  it('defaults to PAGE_SIZE of 24', () => {
    expect(PAGE_SIZE).toBe(24)
    expect(paginate(items, 1)).toHaveLength(24)
  })
})

describe('pageCount', () => {
  it('returns 1 for an empty list', () => {
    expect(pageCount(0)).toBe(1)
  })

  it('rounds up partial pages', () => {
    expect(pageCount(25, 10)).toBe(3)
    expect(pageCount(20, 10)).toBe(2)
  })
})
