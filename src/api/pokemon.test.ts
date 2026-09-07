import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchPokemon, fetchPokemonIndex } from '@/api/pokemon'

function mockFetchOnce(body: unknown, ok = true, status = 200) {
  const res = {
    ok,
    status,
    statusText: ok ? 'OK' : 'Error',
    json: async () => body,
  } as Response
  return vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(res)
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('fetchPokemonIndex', () => {
  it('requests the full index and parses results (no network)', async () => {
    const spy = mockFetchOnce({
      results: [
        { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
      ],
    })
    const result = await fetchPokemonIndex()
    expect(result).toEqual([{ id: 25, name: 'pikachu' }])
    expect(spy).toHaveBeenCalledWith(
      'https://pokeapi.co/api/v2/pokemon?limit=100000',
    )
  })
})

describe('fetchPokemon', () => {
  it('fetches and parses a detail response', async () => {
    mockFetchOnce({
      id: 25,
      name: 'pikachu',
      types: [{ slot: 1, type: { name: 'electric' } }],
    })
    const result = await fetchPokemon(25)
    expect(result).toEqual({
      id: 25,
      name: 'pikachu',
      types: ['electric'],
      spriteUrl:
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
    })
  })

  it('throws when the response is not ok', async () => {
    mockFetchOnce({}, false, 404)
    await expect(fetchPokemon('missingno')).rejects.toThrow()
  })
})
