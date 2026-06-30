---
name: data-layer
description: Use when adding or changing data access in this movie-catalog app — reading/writing movies or favorites, adding a route handler, an entities/api fetcher/query/mutation, wiring auth/session, or anything touching Drizzle, TanStack Query, Better Auth, or proxy.ts. Trigger whenever a task involves the database, an API endpoint, fetching/mutating on the client, or session/auth. For pure file placement/naming use the sibling app-structure skill; this skill owns HOW data flows.
---

# data-layer

The data architecture for this app. One rule governs everything: **the database is reached only through route-handler endpoints, and reads are consumed in SSR.** Drizzle never runs in a component, module, or `entities/api` file — only in `src/app/(api)/api/**/route.ts`.

## The contract

```
Browser ─┐
         │  (client) useMutation / useQuery  (favorite-toggle)
         ▼
Server Component (RSC, SSR)  ──await──►  entities/api/<api>/<api>.api.ts  (fetch client)
                                                   │ HTTP (NEXT_PUBLIC_APP_URL)
                                                   ▼
                                   (api)/api/<route>/route.ts  ──Drizzle──►  Supabase Postgres
                                                   ▲
                                   Better Auth: getSession() reads the session cookie
```

- **Drizzle** (`db.select/insert/update/delete`) lives **only** in `(api)/api/**/route.ts` and `pkg/db` (client + schema + seed).
- **`entities/api/<api>/<api>.api.ts`** are thin `fetch` clients to those endpoints (`base = envClient.NEXT_PUBLIC_APP_URL`). Favorites send `credentials:'include'`.
- **Reads happen in Server Components (SSR):** `movies.module` / `movie-details.module` `await listMovies()` / `getMovieById(id)`; `favorites.module` calls `modules/favorites/favorites.service.ts#getFavoriteMovies` which fetches `/api/favorites/movies` **forwarding the session cookie** via `next/headers`. Their pages are `force-dynamic` (movies) / dynamic-by-`getSession` (favorites).
- **Writes / live client state:** only `features/favorite-toggle` is `'use client'` — `useFavorites` (`useQuery`) for current state + `useFavoriteToggle` (`useMutation`) for add/remove with **optimistic update + rollback + invalidation**.
- **Auth:** Better Auth instance in `shared/auth/auth.server.ts` (Drizzle adapter), mounted at `/api/auth/[...all]`; client hooks in `shared/auth/auth.client.ts`; `proxy.ts` guards `/favorites` by cookie presence (authoritative check is `getSession()` in the page).

## Endpoints (the only DB access points)

| Method · Route | Auth | Drizzle |
|---|---|---|
| `GET /api/movies` | public | `select items order by created_at desc` |
| `GET /api/movies/[id]` | public | uuid-guard → `select items where id` → 404 |
| `GET /api/favorites` | session (else `[]`) | `select favorites where userId` |
| `POST /api/favorites` | session (401) | uuid-guard body → `insert ... onConflictDoNothing` |
| `GET /api/favorites/movies` | session (401) | `favorites ⋈ items where userId` |
| `DELETE /api/favorites/[itemId]` | session (401) | `delete where userId & itemId` |
| `* /api/auth/[...all]` | — | Better Auth `toNextJsHandler` |

`userId` is **always** derived from `auth.api.getSession({ headers: await headers() })` — never from the request body (DoD: a user's favorites are private).

## Hard rules

1. **DB only in endpoints** — `db.*` appears only under `(api)/api/**/route.ts`. Components/modules/`entities/api` import `entities/api` fetchers, not `@/pkg/db`.
2. **Reads in SSR** — page reads go through Server Components awaiting the endpoint. Pages that fetch at request time are `force-dynamic`; auth pages are dynamic via `getSession()`.
3. **Mutations on the client** — favorites add/remove via `useFavoriteToggle` (optimistic on `FAVORITES_KEY`, rollback in `onError`, `invalidateQueries` in `onSettled`).
4. **Session is server-derived** — endpoints read the session cookie; never trust a client-supplied userId. `proxy.ts` is an optimistic gate only.
5. **Models are wire types** — `IMovie`/`IFavorite` derive from the Drizzle schema (`InferSelectModel`, `import type`); over HTTP `created_at` is an ISO string (not used in UI).

## File map

- `pkg/db/` — `db.client.ts` (`drizzle(postgres(envServer.DATABASE_URL))`), `schema.table.ts` (better-auth tables + `items` + `favorites`), `seed.util.ts`, `index.ts` (exports `db`).
- `pkg/query/` — `QueryProvider` (client `QueryClientProvider`), mounted in the root layout.
- `shared/auth/` — `auth.server.ts` (`betterAuth({ database: drizzleAdapter(db,{provider:'pg',schema}) })` + `getSession`), `auth.client.ts` (`createAuthClient`, `signIn/signUp/signOut/useSession`), `index.ts` (client only).
- `(api)/api/.../route.ts` — the endpoints above.
- `entities/api/movies/` — `movies.api.ts` (`listMovies`, `getMovieById`), barrel. (No query — movies are SSR-read.)
- `entities/api/favorites/` — `favorites.api.ts` (`listFavorites`, `addFavorite`, `removeFavorite`), `favorites.query.ts` (`FAVORITES_KEY`, `favoritesQueryOptions`, `useFavorites`), `favorites.mutation.ts` (`toggleFavorite`, `useFavoriteToggle`), barrel.
- `modules/favorites/favorites.service.ts` — `'server-only'` SSR read that forwards cookies to `/api/favorites/movies`.

## Adding a new data path (recipe)

1. **Route handler first** — `src/app/(api)/api/<route>/route.ts`: import `db` + table from `@/pkg/db` / `@/pkg/db/schema.table`, validate input, derive `userId` from `getSession` if protected, run Drizzle, `NextResponse.json(...)`.
2. **Fetch client** — `entities/api/<api>/<api>.api.ts`: `fetch(\`${base}/api/<route>\`, …)`; add `credentials:'include'` for auth routes.
3. **Consume:**
   - SSR read → call the fetcher from a Server Component module (await). If it's auth-scoped, forward cookies via a `'server-only'` module service (`headers: await headers()`). Mark the page `force-dynamic`.
   - Client write/live → `<api>.query.ts` (`useQuery`) + `<api>.mutation.ts` (`'use client'` `useMutation` with optimistic update + invalidation), consumed by a `'use client'` feature.
4. **Types** — add/update `entities/models/<entity>.model.ts` (`InferSelectModel`, `import type`).

## Self-verification

- `grep -rnE "db\.(select|insert|update|delete)" src/app --include=*.ts | grep -v "(api)/api"` → empty (no DB outside endpoints).
- `grep -rn "process.env" src --include=*.ts | grep -v config/env | grep -v NODE_ENV` → empty.
- Favorites endpoints derive `userId` from `getSession`, not the body.
- `*.mutation.ts` is `'use client'`; `*.api.ts` / `*.query.ts` are not.
- `entities/models/*.model.ts` import the table with `import type`.
- `tsc --noEmit`, `eslint`, `vitest`, and `next build` are green.

## Notes & deviations

- **DB-through-endpoints-in-SSR is a deliberate project choice.** Next's more idiomatic pattern is reading Drizzle directly in Server Components + Server Actions for writes; this app instead funnels all DB access through `(api)` endpoints and consumes them in SSR (a Server Component fetching its own app's endpoint). Keep the endpoint indirection unless the user changes the decision.
- `next build` succeeds without a DB because list/detail/favorites are dynamic and `/api/*` are runtime-only; the DB is hit only at request time. Full runtime needs a Supabase `.env.local` (`DATABASE_URL`, `DIRECT_URL`, `BETTER_AUTH_SECRET` ≥32, `BETTER_AUTH_URL`, `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_BETTER_AUTH_URL`).
