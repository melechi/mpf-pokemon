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

# DATA STRUCTURE

type PokemonSummary = {
  id: number;
  name: string;
  spriteUrl: string | null;
  types: string[];
  addedAt: number;
};

type Group = {
  id: string;
  name: string;
  color: string;
  members: PokemonSummary[];
  createdAt: number;
};

type UserData = {
  version: 1;
  groups: Record<string, Group>;
  groupOrder: string[];
};

const FAVOURITES_ID = 'favourites';


// api/schemas.ts — shape of PokéAPI responses, parsed and trimmed
type PokemonListItem = {
  id: number;              // extracted from url
  name: string;
};

type Pokemon = {
  id: number;
  name: string;
  types: string[];         // flattened from types[].type.name
  spriteUrl: string | null;
};

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

## Phase 2

This is the data layer phase.

We're using the PokeAPI for this project. Implement by following specification in docs:
https://pokeapi.co/docs/v2

The Base URL is "https://pokeapi.co/api/v2".
We'll be using the official artwork CDN URL pattern for the spriteUrl (see data structure).

### Index Strategy
There is no search endpoint. So we'll need to fetch all and cache.
ie /pokemon?limit=100000 - staleTime: Infinity
We will filter on the client side by substring.

### ID Extraction
The index only gives us name and url. ID should be extracted from the URL. Limit extraction to 1 location, don't repeat this logic all over the codebase.


### Sprites

Sprites shoudld be rendered based on the CDN pattern by the pokemon's ID. No extra fetching for sprites.

### Schema & Data Parsing

Strictly model ONLY the fields listed in our DATA STRUCTURE. Do not model the full response from the API.
Use .parse() not .safeParse(). We want failures to throw and be captured by React Query.
All types are being derived with zod's inference feature. So do not hand write those types.

### Search
Pure functions over the index array. No React, no fetching.

We want to filter pokemon by name.
Filtering should be a case-insensitive substring match.
Empty and whitespace only queries should return all results.
No sorting or fuzzy matching.
This is strictly client-side, no querying.

#### Pagination

Pages start at 1.
Out of range pages return empty.
The page count is a minimum of 1 (even with 0 resulting pokemon).
Set page size as a default constant of 24.
This is strictly client-side, no querying.

### Tests

Write vitest tests for the schema pass. Use a small fixture of the real API response.

Schemas:
- Index fixture with 2-3 real entries parses to expected `{ id, name }`,
  including correct ID extraction from the URL.
- Detail fixture parses and flattens `types` to `string[]`.
- Malformed input throws.

Search:
- `filterPokemon` matches mid-string, not just prefix.
- Case-insensitive both directions.
- Empty and whitespace-only queries return the full list.
- No match returns an empty array.
- `paginate` returns the correct slice for pages 1 and 2.
- `paginate` returns an empty array past the end.
- `pageCount` returns 1 for an empty list.

Client:
- `spriteUrl` returns the expected URL for a known ID.

Mock `fetch`; no network calls in tests.

### Verify

Build succeeds
Typecheck passes
Lint passes, zero warnings
Vitest passes
Nothing in api/ imports React.
No imports from components/ into queries/.
Present result at end.
Confirm pass with user.
Then STOP.


## Phase 3

This is the State layer.
State only.
Building in state/ only.

### Architecture

We're using jotai atoms.
We want a single atom, single source of truth which is going to hold the UserData object.
We require local storage, so use atomWithStorage and apply a custom valiation adapter.
Everything runs through this.


Transition logic is written as plain functions over UserData (UserData -> UserData).
The write atoms call those functions. This keeps all the logic testable without Jotai.


### Storage

Put storage in state/storage.ts
This is where all the logic for atomWithStorage will live.
Use a single key.

#### Read

Parse stored JSON through UserDataSchema with .safeParse().
On ANY failure, return a fresh default. Never throw or crash the app on bad stored data. This is the deliberate exception to the parse-not-safeParse rule.
The schema requires Favourites present and first in groupOrder, so recovery from a missing or misordered Favourites happens here.
Downstream code may assume Favourites always exists.

#### Write

Serialise the whole object.

The default UserData is constructed with Favourites already present:
reserved ID, first in groupOrder, reserved colour, empty members.
Favourites is never created lazily.

### Colours

Use constant GROUP_COLORS as an array of colour tokens (not hex or raw classes).
Reserve a token for Favourites.
A token -> Tailwind class lookup object.

Tailwind cannot see interpolated class names. Never build classes as bg-${token}-500. Always map token to a complete static class string.

### Collections

Atoms, derived read atoms, and write action atoms.

Clarification: A Pokémon may belong to any number of groups. addedAt is stamped per membership, so the same Pokémon in three groups has three timestamps.

### Tests

Test the plain transition functions directly; do not test through Jotai.

- Default state contains Favourites, first in order.
- `addToGroup` twice with the same Pokémon leaves one member.
- `removeFromGroup` leaves the same Pokémon in other groups untouched.
- `toggleFavourite` off removes from Favourites only.
- `deleteGroup(FAVOURITES_ID)` throws.
- `renameGroup(FAVOURITES_ID)` throws.
- `createGroup` assigns a colour from the palette, never the reserved one.
- Storage read of malformed JSON returns the default.
- Storage read of valid-JSON-but-invalid-shape returns the default.
- `toSummary` stamps the timestamp it was given.

### Verify

Build succeeds
Typecheck passes
Lint passes, zero warnings
Vitest passes
Nothing in state/ imports from components/ or queries/.
Present result at end.
Confirm pass with user.
Then STOP.

## Phase 4

This begins the visuals phase with proper browsing.

This phase includes browsing, starring, searching and pagination.
Visually, this the browsing is rendered as a grid of cards.

### Route

/ - The initial default route which renders BrowsePage.tsx.

Search query and pagination variables live in the query string, not component state. Use "q" for the query param, keep this and other variables you choose to name for this consistant in future phases.

### Data Flow

A hook to fetch the full index once. Uses caching rules to cache it forever.
That full data set is then worked on from this point. So anything that wants to transform the data applies those transforms on that cached data.
These are functions found in our API search file.

Each card needs to run its own usePokemonDetail query. Limit it to visible cards only. Load as required (paginated, searched etc).
Make sure to always render loading skeletons for cards while they're loading.


### Components

These should all be responsive across multiple devices. Setup CSS accordingly. Be mindful of this with your tailwind class application.
Also keep in mind accessibility on components, buttons etc.

Working with the following components:
SearchBar - I mentioned the "q" param earlier. Use that, debounce the typing.
Pagination
PokemonGrid - Renders PokemonCards. Ues Loading Skeleton. Match Dimentions.
PokemonCard
TypePill - Use colour codes defined in previous phase.
StarButton - Use an Icon. This is a toggle button.
EmptyState


### States to handle

Index loading: a grid of skeletons.
Index error: a message with a retry action, not a blank screen.
No search results: EmptyState naming the query that found nothing.
Page out of range after a search narrows results: reset to page 1 whenever the query changes.


### Interaction detail

Starring requires a PokemonSummary, which needs detail data.
The card already has it from its own query, so build the summary there via toSummary and pass it to toggleFavourite.
Disable the star until detail has loaded.


### Verify

Build succeeds
Typecheck passes
Lint passes, zero warnings
Vitest passes
Components do not import from api/ directly; they go through queries/ and state/.
Present result at end.

Ask user to verify:
Search, pagination and starring work. A starred Pokémon survives a page refresh.

Confirm pass with user.
Then STOP.


## Phase 5

This is the collections phase.

This is for browsing groups, including favourites.

In other words. Named groups, containing pokemon.

### Routes

/collection` - CollectionPage. All groups.
/collection/:groupId - GroupPage. One group's members.

### CollectionPage

IMPORTANT: Favourites are our hardcoded group. They're pinnd at the top, visually stands out, always rendered.

All other groups are rendered based on their groupOrder.

Each group shows its name, colour, member count, and a few member sprites as a preview. Clicking through goes to GroupPage.
DO NOT render every group member.

CreateGroupForm — name input plus submit. Colour is assigned automatically, not chosen by the user (no colour picker!).
Reject empty and whitespace-only names. Trim before saving.
We need clean, clear inline validation.
Deleting a group happens here, with a confirmation step.
Favourites has no delete or rename affordance; the UI hides them rather than showing a disabled control or relying on the action guard to fire.
Empty state when the user has no groups beyond Favourites, and an empty state for a group with no members.


### GroupPage

Reads the group by :groupId URI parameter. An unknown ID renders a not-found state with a link back, never a visible crash or API error.

Renders the group's members from stored summaries.
No network requests: name, types and sprite all come from the snapshot, so the expectation of this page is that it works offline and renders instantly. 
Removing a Pokémon from a group happens here (applies the same way for Favourites).
Renaming happens here for normal groups, hidden for Favourites.

### GroupPicker

Assigning a Pokémon to a group.
Lists all groups with membership state from groupIdsContaining, so the user can see and toggle membership across several groups at once.
Favourites group should be ignored here.
Reachable from PokemonCard on the browse page. It needs the summary, so it follows the same rule as the star: available once detail has loaded.

### Reused

PokemonGrid and PokemonCard render group members.
The card's behaviour differs by context: on browse it stars, in a group it offers removal.
Drive this with a prop rather than duplicating the component.

### Verify

Build succeeds
Typecheck passes
Lint passes, zero warnings
Vitest passes
Components do not import from api/ directly; they go through queries/ and state/.
Present result at end.

Ask user to verify:
Create, rename, delete, assign and remove all work and survive a refresh.
Deleting a group does not remove its members from other groups.
Favourites cannot be deleted or renamed through the UI.
GroupPage with a bad ID does not crash.

Confirm pass with user.
Then STOP.


## Phase 6

This is a user phase. You should be on stand-by to fix any bugs.
Time permitting, we may throw a design from claude design at this.

