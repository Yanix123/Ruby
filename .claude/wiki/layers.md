# Layers (FSD)

Every file belongs to exactly one layer. Imports flow **downward only**: `(web)/(api) → modules → widgets → features → entities → shared`; `config/` and `pkg/` are infra (importable anywhere). The placement rules and decision trees are encoded in the `app-structure` skill — see [[conventions-and-skills]].

## `(web)/` — pages
App Router pages, thin shells. `layout.tsx` wires providers (`ThemeProvider > QueryProvider`, `SiteHeader`, sonner `Toaster`). `page.tsx` files render a module: `/` redirects to `/movies`; `movies/(list)`, `movies/[id]`, `favorites`, `login`, `register` each render their module; `error.tsx`/`not-found.tsx` render `ErrorModule`/`NotFoundModule`. `loading.tsx` provides route-level skeletons. See [[routing]].

## `(api)/api/` — route handlers
The **only** place Drizzle runs and Better Auth is mounted: `auth/[...all]`, `movies`, `movies/[id]`, `favorites`, `favorites/movies`, `favorites/[itemId]`. See [[data-flow]] and [[auth]].

## `modules/` — page logic
One slice per page/domain: `movies`, `movie-details`, `favorites`, `auth-login`, `auth-register`, `not-found`, `error`. `<module>.module.tsx` is the entry — a Server Component that `await`s endpoint reads (`movies`, `movie-details`, `favorites`) or a thin wrapper (`auth-*`, `not-found`, `error`). `modules/favorites` also has a `favorites.service.ts` (`'server-only'` cookie-forwarding SSR read). Modules never import each other.

## `widgets/` — composite UI
`site-header` (nav + session-aware sign-out, client), `movie-card` (link wrapper around the shared card), `favorites-list` (grid + empty state). Compose features/shared; no page concerns.

## `features/` — single-purpose
`favorite-toggle` (the only data-interactive client feature: `useFavorites` + `useFavoriteToggle`), `auth-login` / `auth-register` (react-hook-form forms calling Better Auth client). See [[state-and-forms]].

## `entities/` — domain data
- `api/<resource>/` — client data layer. `movies` has `movies.api.ts` (fetch clients) only (SSR-read); `favorites` has `favorites.api.ts` + `favorites.query.ts` + `favorites.mutation.ts`.
- `models/<entity>.model.ts` — types only: `IMovie`/`IFavorite` via `InferSelectModel` (type import), `ISignInValues`/`ISignUpValues`.

## `shared/` — cross-layer
- `ui/` — shadcn-based primitives: `text-field`, `skeleton`, `movie-card` (presentational `MovieCardView` + `posterUrl`).
- `store/` — Zustand `global.store.ts` (`useGlobalStore`).
- `auth/` — Better Auth `auth.client.ts` / `auth.server.ts` (deviation: auth kept in shared). See [[auth]].

## `config/` & `pkg/` — infra
- `config/`: `env/` (t3-env gate), `fonts/`, `styles/global.css`. See [[config-and-env]].
- `pkg/`: `theme` (shadcn `cn`, `ThemeProvider`, `ui/*`), `db` (Drizzle client/schema/seed), `query` (`QueryProvider`), `lib` (`uuid.util`). Self-contained and liftable.

See also [[architecture]], [[data-flow]], [[conventions-and-skills]].
