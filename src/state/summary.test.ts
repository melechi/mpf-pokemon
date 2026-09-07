import { describe, expect, it } from 'vitest'
import type { Pokemon } from '@/api/schemas'
import { toSummary } from '@/state/summary'

const pokemon: Pokemon = {
  id: 25,
  name: 'pikachu',
  types: ['electric'],
  spriteUrl:
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
}

describe('toSummary', () => {
  it('stamps the timestamp it was given', () => {
    expect(toSummary(pokemon, 999).addedAt).toBe(999)
  })

  it('carries over the relevant fields', () => {
    expect(toSummary(pokemon, 42)).toEqual({
      id: 25,
      name: 'pikachu',
      types: ['electric'],
      spriteUrl: pokemon.spriteUrl,
      addedAt: 42,
    })
  })
})
