// Group colour tokens and their static Tailwind classes.
//
// Tailwind cannot see interpolated class names, so we NEVER build classes like
// `bg-${token}-500`. Every token maps to a complete, static class string that
// appears literally in this file for the Tailwind scanner to find.

/** Reserved colour token for the Favourites group. Never assigned to user groups. */
export const FAVOURITES_COLOR = 'amber'

/** Palette of colour tokens assignable to user-created groups (excludes the reserved one). */
export const GROUP_COLORS = [
  'rose',
  'orange',
  'lime',
  'emerald',
  'sky',
  'indigo',
  'violet',
  'fuchsia',
] as const

export type GroupColorToken = (typeof GROUP_COLORS)[number]
export type ColorToken = GroupColorToken | typeof FAVOURITES_COLOR

/** token -> complete static Tailwind class string. */
export const COLOR_CLASSES: Record<ColorToken, string> = {
  amber: 'bg-amber-100 text-amber-800 border-amber-300',
  rose: 'bg-rose-100 text-rose-800 border-rose-300',
  orange: 'bg-orange-100 text-orange-800 border-orange-300',
  lime: 'bg-lime-100 text-lime-800 border-lime-300',
  emerald: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  sky: 'bg-sky-100 text-sky-800 border-sky-300',
  indigo: 'bg-indigo-100 text-indigo-800 border-indigo-300',
  violet: 'bg-violet-100 text-violet-800 border-violet-300',
  fuchsia: 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-300',
}

/** Look up the class string for a colour token, falling back to the reserved colour. */
export function colorClass(token: string): string {
  return COLOR_CLASSES[token as ColorToken] ?? COLOR_CLASSES[FAVOURITES_COLOR]
}
