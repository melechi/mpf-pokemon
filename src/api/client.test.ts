import { describe, expect, it } from 'vitest'
import { idFromUrl, spriteUrl } from '@/api/client'

describe('spriteUrl', () => {
  it('returns the official-artwork URL for a known id', () => {
    expect(spriteUrl(6)).toBe(
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png',
    )
  })
})

describe('idFromUrl', () => {
  it('extracts the id from a resource url', () => {
    expect(idFromUrl('https://pokeapi.co/api/v2/pokemon/25/')).toBe(25)
  })

  it('throws when there is no id to extract', () => {
    expect(() => idFromUrl('https://pokeapi.co/api/v2/pokemon/')).toThrow()
  })
})
