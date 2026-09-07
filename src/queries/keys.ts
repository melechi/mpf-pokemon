// Query key factory for React Query. Keeps keys consistent across hooks.

export const pokemonKeys = {
  all: ['pokemon'] as const,
  index: () => [...pokemonKeys.all, 'index'] as const,
  detail: (nameOrId: string | number) =>
    [...pokemonKeys.all, 'detail', nameOrId] as const,
}
