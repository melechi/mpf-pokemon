import { atomWithStorage } from 'jotai/utils'
import { defaultUserData, userDataSchema, type UserData } from '@/state/types'

// Single source of truth: one atom, persisted under one localStorage key with a
// Zod-validating adapter.

export const STORAGE_KEY = 'mpf-pokemon:userData'

/**
 * Parse a stored JSON string through UserDataSchema with safeParse. On ANY
 * failure (bad JSON, wrong shape, missing/misordered Favourites) return a fresh
 * default — never throw. This is the deliberate exception to the parse-not-
 * safeParse rule.
 */
export function parseStoredUserData(raw: string | null): UserData {
  if (raw === null) return defaultUserData()
  try {
    const result = userDataSchema.safeParse(JSON.parse(raw))
    return result.success ? result.data : defaultUserData()
  } catch {
    return defaultUserData()
  }
}

const userDataStorage = {
  getItem: (key: string, initialValue: UserData): UserData => {
    if (typeof localStorage === 'undefined') return initialValue
    return parseStoredUserData(localStorage.getItem(key))
  },
  setItem: (key: string, value: UserData): void => {
    if (typeof localStorage === 'undefined') return
    localStorage.setItem(key, JSON.stringify(value))
  },
  removeItem: (key: string): void => {
    if (typeof localStorage === 'undefined') return
    localStorage.removeItem(key)
  },
}

/** The single UserData atom. Everything runs through this. */
export const userDataAtom = atomWithStorage<UserData>(
  STORAGE_KEY,
  defaultUserData(),
  userDataStorage,
  { getOnInit: true },
)
