# MPF Front End Developer Site Build

## Audience
This is intended for Humans. If you're an AI agent, refer to docs/spec.md.


## Running this Application

You can skip local installtion and see it live here: https://mpf-pokemon.vercel.app/

### Prerequisites

Node 20 or later. Check with node -v.

pnpm. Install with npm i -g pnpm if you don't have it.

No API key or environment variables are needed. PokéAPI is public and unauthenticated.

### Install

git clone git@github.com:melechi/mpf-pokemon.git
cd mpf-pokemon
pnpm install

### Run

pnpm dev

Serves at http://localhost:5173

### Other commands

pnpm build        # production build to dist/
pnpm preview      # serve the production build locally
pnpm test         # unit tests
pnpm lint         # eslint
pnpm typecheck    # tsc --noEmit

### Notes

Favourites and groups are stored in the browser's localStorage, so data is per-browser and per-device. Clearing site data resets it.


## Approach
I started by reading through the requirements document and breaking down what I need to do.
I chosesn to use the pokeapi and buld a React TypeScript application running on vite.
I'll host this on vercel since I already have an account setup and that's a 5 minute task.

I'm taking an AI frist approach. I exclusively use Claude as my AI agent. I use varying models, and interfaces/tools (desktop, code, design).

Discuss requirements with desktop agent to get the right headspace.

Hand wrote most of spec.md for agent. Some things like actual typescript stucture came out of discussions with claude rather than hand-writing.
This has been broken down into a 6 phase project.
After phase 3, progress was rather fast while working with claude to affirm how to piece it all together.


### Stack

I've used a common standard stack for a simple React app.
React Router with TanStack Query for state handling. The Pokemon data is immutable, so we can just load and cache it, work with that as our data set and run queries against it. TanStack Query means there is no refetching of the data, instant back-navigation is handled.

I am most familiar with Jotai for working with state. There are other libraries I could have chosesn, but I like this one and it gives a useful localStorage handler out of the box.

Zod at both boundaries: parsing PokéAPI responses on the way in, validating stored data on the way out of localStorage.

Tailwind v4 for styling. No design system needed at this size, and it kept styling decisions inline with markup under time pressure.

Vitest for unit tests, focused on pure logic rather than rendering.

### Architecture

I've tried to keep a strict one-directional layering architcture going on here.
api/ has no React imports at all.
queries/ knows about api/ and React but not components.
components/ never fetch or construct URLs.

2 State Layers:
* TanStack Query for server, which in this case is the Pokemon API.
* Jotai for local handling of the large cached dataset.

Regarding the large dataset, the Pokemon API has no search, so I've had to load it all at once with a caching flag on the request. Its really not a big payload and for this simple app, it keeps things snappy.

The sprites aren't using their sprite API. I use the CDN instead. Saves n requests per page and is overall much faster.

Favourites are just like any other group, but treated a bit special in the app. Keeps the data structure simple, reduces code duplication.

Group membership stores a denormalised snapshot of each Pokémon rather than an ID. The collection pages render with zero network requests and work offline.

Persistence goes through a repository-style adapter with async signatures, even though localStorage is synchronous. Swapping to a server would be a single-file change once there is auth to key records to.

Storage validates on read and heals at the boundary: any parse failure returns a fresh default, so downstream code can assume the shape is valid and Favourites exists. This is the deliberate exception to the throw-on-parse-failure rule used at the API boundary.

UserData carries a version field so a future migration has something to branch on.

### Trade-Offs

* With the given time limit, I chose to keep things as simple as I could. So no backend which could have maybe synced the data into a local database to be ready for a larger application.
* Test coverage is deliberately narrow: schemas, search, pagination and state transitions. No component or E2E tests.
* Haven't really harded the storage. If something goes wrong with it, one has to start over.aging valid groups.
* Accessibility is likely basic implementation from claude's work. Could give a lot more detail to run with for this given more time.


### FUTURE IMPROVEMENTS:

* Sorting groups by their creation date.
* Pagination of group members in the group view.
* Usercontrol over colours.


### Additional Notes

Note that when I ran the spec through Claude Code (Using my preferred model Opus 4.8), some ambiguity was found and correctly prompted for. I have chosen to leave the spec unchanged as it correctly demonstraits the agent following the insturctions.


## BONUS ROUND

Checkout the design branch and run it with the same instructions as above.

Or browse directly to the hosted version of it here: https://mpf-pokemon-git-design-p3das-projects.vercel.app/
