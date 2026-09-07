// Group colour tokens and their static Tailwind classes.
//
// Tailwind cannot see interpolated class names, so we NEVER build classes like
// `bg-${token}-500`. Every token maps to a complete, static class string that
// appears literally in this file for the Tailwind scanner to find.

/** Reserved colour token for the Favourites group. Never assigned to user groups. */
export const FAVOURITES_COLOR = 'gold'

/** Palette of colour tokens assignable to user-created groups (excludes the reserved one). */
export const GROUP_COLORS = [
  'ocean',
  'mint',
  'grape',
  'mango',
  'berry',
  'sky',
] as const

export type GroupColorToken = (typeof GROUP_COLORS)[number]
export type ColorToken = GroupColorToken | typeof FAVOURITES_COLOR

/** token -> complete static Tailwind class string. */
export const COLOR_CLASSES: Record<ColorToken, string> = {
  gold: 'bg-amber-400 text-amber-950', // Favourites (reserved)
  ocean: 'bg-sky-500 text-white',
  mint: 'bg-emerald-500 text-white',
  grape: 'bg-violet-500 text-white',
  mango: 'bg-orange-500 text-white',
  berry: 'bg-fuchsia-600 text-white',
  sky: 'bg-cyan-500 text-cyan-950',
}

/** Look up the class string for a colour token, falling back to the reserved colour. */
export function colorClass(token: string): string {
  return COLOR_CLASSES[token as ColorToken] ?? COLOR_CLASSES[FAVOURITES_COLOR]
}

// ---------------------------------------------------------------------------
// Pokémon type colours. Same static-class discipline: full class strings only,
// never interpolated, so the Tailwind scanner can see every one.
// ---------------------------------------------------------------------------

export const TYPE_COLORS: Record<string, string> = {
  normal: 'bg-stone-400 text-white',
  grass: 'bg-lime-700 text-white',
  fire: 'bg-orange-700 text-white',
  water: 'bg-sky-700 text-white',
  electric: 'bg-amber-400 text-amber-950',
  ice: 'bg-cyan-700 text-white',
  fighting: 'bg-red-700 text-white',
  poison: 'bg-fuchsia-700 text-white',
  ground: 'bg-yellow-700 text-white',
  flying: 'bg-indigo-400 text-indigo-950',
  psychic: 'bg-pink-600 text-white',
  bug: 'bg-green-700 text-white',
  rock: 'bg-stone-600 text-white',
  ghost: 'bg-violet-700 text-white',
  dragon: 'bg-indigo-700 text-white',
  dark: 'bg-slate-800 text-white',
  steel: 'bg-slate-500 text-white',
  fairy: 'bg-rose-400 text-rose-950',
}

const TYPE_FALLBACK = 'bg-stone-200 text-stone-800'

/** Look up the complete Tailwind class string for a Pokémon type pill. */
export function typeClass(type: string): string {
  return TYPE_COLORS[type.toLowerCase()] ?? TYPE_FALLBACK
}

// Per-card tint by primary type: a solid strip across the card top and a soft
// pad behind the sprite. Parallel static maps, one entry per type.
export const TYPE_STRIP: Record<string, string> = {
  normal: 'bg-stone-400',
  grass: 'bg-lime-700',
  fire: 'bg-orange-700',
  water: 'bg-sky-700',
  electric: 'bg-amber-500',
  ice: 'bg-cyan-700',
  fighting: 'bg-red-700',
  poison: 'bg-fuchsia-700',
  ground: 'bg-yellow-700',
  flying: 'bg-indigo-500',
  psychic: 'bg-pink-600',
  bug: 'bg-green-700',
  rock: 'bg-stone-600',
  ghost: 'bg-violet-700',
  dragon: 'bg-indigo-700',
  dark: 'bg-slate-800',
  steel: 'bg-slate-500',
  fairy: 'bg-rose-500',
}

export const TYPE_PAD: Record<string, string> = {
  normal: 'bg-stone-100',
  grass: 'bg-lime-50',
  fire: 'bg-orange-50',
  water: 'bg-sky-50',
  electric: 'bg-amber-50',
  ice: 'bg-cyan-50',
  fighting: 'bg-red-50',
  poison: 'bg-fuchsia-50',
  ground: 'bg-yellow-50',
  flying: 'bg-indigo-50',
  psychic: 'bg-pink-50',
  bug: 'bg-green-50',
  rock: 'bg-stone-100',
  ghost: 'bg-violet-50',
  dragon: 'bg-indigo-50',
  dark: 'bg-slate-100',
  steel: 'bg-slate-50',
  fairy: 'bg-rose-50',
}

/** Solid strip colour for a card's primary type. */
export function typeStrip(type: string | undefined): string {
  return (type && TYPE_STRIP[type.toLowerCase()]) || 'bg-stone-300'
}

/** Soft pad colour behind a card's sprite, keyed by primary type. */
export function typePad(type: string | undefined): string {
  return (type && TYPE_PAD[type.toLowerCase()]) || 'bg-stone-100'
}
