import { describe, expect, it } from 'vitest'
import { parseStoredUserData } from '@/state/storage'
import { defaultUserData, FAVOURITES_ID } from '@/state/types'

describe('parseStoredUserData', () => {
  it('returns the default on malformed JSON', () => {
    const data = parseStoredUserData('{ this is not json')
    expect(data.groups[FAVOURITES_ID]).toBeDefined()
    expect(data.groupOrder[0]).toBe(FAVOURITES_ID)
  })

  it('returns the default on valid JSON with an invalid shape', () => {
    // Valid JSON, but Favourites is missing -> schema refine fails -> default.
    const raw = JSON.stringify({ version: 1, groups: {}, groupOrder: [] })
    const data = parseStoredUserData(raw)
    expect(data.groups[FAVOURITES_ID]).toBeDefined()
    expect(data.groupOrder[0]).toBe(FAVOURITES_ID)
  })

  it('round-trips a valid stored value', () => {
    const good = defaultUserData(0)
    expect(parseStoredUserData(JSON.stringify(good))).toEqual(good)
  })
})
