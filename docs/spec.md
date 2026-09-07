# AUDIENCE

The purpose of this document is to be read by an AI agent. If you are a human, refer to the README.md in the root.


# USER INTERACTION

If any instruction, requirements or with interactions with the user are ambiguous, prompt the user rather than make your own decision. 

# GOALS & CONSTRAINTS

A strictly front-end only React application which will interfact with the https://pokeapi.co/ API. It consists mostly of a browsable landing page, with the ability to favourte a pokemon or add it to a group. A collections page will be to view the favourites group and other groups made by the user.
IMPORTANT: No backend, no auth, no server.
DO NOT add libraries not listed in this document without asking.


# LIBRARIES

Vite
TypeScript (strict)
React
React Router
TanStack Query
Jotai
Tailwind v4
Zod
Vitest
jsdom
Prettier
@testing-library/react

# DIRECTORY LAYOUT
src/
  api/
    client.ts              base URL, fetch wrapper, spriteUrl helper
    schemas.ts             PokéAPI Zod schemas + z.infer types
    pokemon.ts             fetchPokemonIndex, fetchPokemon
    search.ts              filterPokemon, paginate, pageCount, PAGE_SIZE
  queries/
    keys.ts                query key factory
    usePokemonIndex.ts
    usePokemonDetail.ts
  state/
    types.ts               UserData, Group, PokemonSummary + their Zod schemas
    storage.ts             Zod-validating localStorage adapter
    collections.ts         atoms, derived atoms, write actions
    summary.ts             toSummary(pokemon, now) -> PokemonSummary
    colors.ts              GROUP_COLORS palette + token -> Tailwind class map
  components/
    AppShell.tsx
    Nav.tsx
    SearchBar.tsx
    Pagination.tsx
    PokemonGrid.tsx
    PokemonCard.tsx
    PokemonCardSkeleton.tsx
    TypePill.tsx
    StarButton.tsx
    GroupPicker.tsx
    GroupList.tsx
    CreateGroupForm.tsx
    EmptyState.tsx
  routes/
    index.tsx              router config
    BrowsePage.tsx
    CollectionPage.tsx
    GroupPage.tsx          /collection/:groupId
  lib/
    cn.ts                  class merge helper
  main.tsx
  App.tsx

# CONVENTIONS

Use Path Aliases

After every task - iterate until all pass:
Build succeeds
Typecheck passes
Lint passes, zero warnings
Vitest passes 

For data loading, PokemonCardSkeleton.tsx will be used. Don't use external libraries. Do something like <div className="animate-pulse bg-slate-200 rounded" /> - this is cheap and we can have better control over it.

# PHASES

## Phase 1

This is the Scaffold phase.
There is an existing inital vite/TS base scaffold in place. Gather requirements, audit and build on top of this existing scaffold.

Build directory structure with empty placeholders, exactly as specified in the DIRECTORY LAYOUT secton, do so in the root of this project, not another subfolder.
Don't implement features, styling or sate yet.
Implement routes with placeholder text for /, /collection, /collection/:groupId

Run initial setup and then verify.
Present result at end.
Confirm pass with user.
Then STOP.

### Setup

Install libaries and dependencies. Note that tailwind v4 should be installed and react-router-dom should use library mode, createBrowserRouter, not framework mode.
Use Node 20+ with pnpm
TypeScript strict: true, noUncheckedIndexedAccess: true
Path alias @/ -> src/
ESLint + Prettier, default recommended configs

### Verify

Scaffolding complete
Dev server runs
Build succeeds
Typecheck passes
Lint passes, zero warnings
Vitest (basic test)
Placeholder routes are accessible and render - Wait. Prompt and verify result with user.
