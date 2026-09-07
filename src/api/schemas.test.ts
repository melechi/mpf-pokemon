import { describe, expect, it } from 'vitest'
import {
  pokemonIndexSchema,
  pokemonListItemSchema,
  pokemonSchema,
} from '@/api/schemas'

// Small fixtures shaped like real PokéAPI responses (trimmed).
const indexFixture = {
  count: 1302,
  next: null,
  previous: null,
  results: [
    { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
    { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
    { name: 'charizard', url: 'https://pokeapi.co/api/v2/pokemon/6/' },
  ],
}

const detailFixture = {
  id: 6,
  name: 'charizard',
  height: 17,
  weight: 905,
  order: 7,
  types: [
    {
      slot: 1,
      type: { name: 'fire', url: 'https://pokeapi.co/api/v2/type/10/' },
    },
    {
      slot: 2,
      type: { name: 'flying', url: 'https://pokeapi.co/api/v2/type/3/' },
    },
  ],
  sprites: { front_default: 'ignored' },
}

describe('pokemonIndexSchema', () => {
  it('parses real entries to { id, name } with ids extracted from the url', () => {
    const result = pokemonIndexSchema.parse(indexFixture)
    expect(result).toEqual([
      { id: 1, name: 'bulbasaur' },
      { id: 2, name: 'ivysaur' },
      { id: 6, name: 'charizard' },
    ])
  })

  it('throws on malformed input', () => {
    expect(() =>
      pokemonIndexSchema.parse({ results: [{ name: 'oops' }] }),
    ).toThrow()
  })
})

describe('pokemonListItemSchema', () => {
  it('throws when the url has no extractable id', () => {
    expect(() =>
      pokemonListItemSchema.parse({
        name: 'x',
        url: 'https://pokeapi.co/api/v2/pokemon/',
      }),
    ).toThrow()
  })
})

describe('pokemonSchema', () => {
  it('parses and flattens types to string[] and derives the sprite url', () => {
    const result = pokemonSchema.parse(detailFixture)
    expect(result).toEqual({
      id: 6,
      name: 'charizard',
      types: ['fire', 'flying'],
      spriteUrl:
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png',
    })
  })

  it('throws on malformed input', () => {
    expect(() =>
      pokemonSchema.parse({ id: 'six', name: 'charizard', types: [] }),
    ).toThrow()
  })
})
