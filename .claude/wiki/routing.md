# Routing

Two routing layers under `src/app/`: **`(web)/`** (pages) and **`(api)/api/`** (route handlers), plus **`src/proxy.ts`** (edge guard).

## `(web)/` — pages

| Route | Access | Render | Module |
|---|---|---|---|
| `/` | public | `redirect('/movies')` | — |
| `/movies` | public | SSR, `force-dynamic` | `MoviesModule` |
| `/movies/[id]` | public | SSR, `force-dynamic` + `generateMetadata` | `MovieDetailsModule` |
| `/favorites` | **auth** | dynamic (`getSession` guard → `/login`) | `FavoritesModule` |
| `/login`, `/register` | public | static shell | `AuthLoginModule` / `AuthRegisterModule` |

Pages stay thin: read `params`, guard/redirect, render a module. `error.tsx`/`not-found.tsx` delegate to `ErrorModule`/`NotFoundModule`; `loading.tsx` files give route-level skeletons. Why `force-dynamic`: the module fetches an endpoint at request time, so the page must not be prerendered at build (see [[data-flow]]).

## `(api)/api/` — route handlers

The only DB access layer. `GET /api/movies`, `GET /api/movies/[id]`, `GET|POST /api/favorites`, `GET /api/favorites/movies`, `DELETE /api/favorites/[itemId]`, and `* /api/auth/[...all]` (Better Auth). Details in [[data-flow]] and [[auth]].

## `proxy.ts` — edge guard

`src/proxy.ts` (Next 16's renamed middleware file) exports `proxy` + a `matcher` for `/favorites/:path*`. It does an **optimistic** check for the Better Auth session cookie and redirects to `/login` if absent — fast, no DB. The **authoritative** check is server-side `getSession()` inside the favorites page. See [[auth]].

## Dynamic vs static (from `next build`)

- Static (`○`): `/`, `/login`, `/register`, `/_not-found`.
- Dynamic (`ƒ`): `/movies`, `/movies/[id]`, `/favorites`, and all `/api/*`.
- `proxy.ts` shows as `Proxy (Middleware)`.

The build succeeds with no database because dynamic routes aren't prerendered and `/api/*` run only at request time.

See [[architecture]], [[layers]], [[data-flow]].
