# Auth (Better Auth)

Email + password auth via **Better Auth** with the **Drizzle adapter**. The instance lives in `src/app/shared/auth/` (project deviation — kept in `shared`, not `pkg`).

## Pieces

- **`shared/auth/auth.server.ts`** (`'server-only'`) — `betterAuth({ database: drizzleAdapter(db, { provider: 'pg', schema }), emailAndPassword: { enabled: true } })` and `getSession()` = `auth.api.getSession({ headers: await headers() })`. Imported only by server code (route handlers, the favorites page guard).
- **`shared/auth/auth.client.ts`** — `createAuthClient({ baseURL: NEXT_PUBLIC_BETTER_AUTH_URL ?? NEXT_PUBLIC_APP_URL })`; re-exports `signIn`, `signUp`, `signOut`, `useSession`.
- **`shared/auth/index.ts`** — exports **client symbols only** (so a client component never pulls the `server-only` Drizzle instance). Server code imports `@/shared/auth/auth.server` directly.
- **`(api)/api/auth/[...all]/route.ts`** — `export const { POST, GET } = toNextJsHandler(auth)`; serves all Better Auth endpoints under `/api/auth/*`.

## Session usage

- **Endpoints** derive identity from `getSession` and scope queries by `userId` — favorites are private; a client-supplied id is never trusted. See [[data-flow]].
- **`/favorites` page** calls `getSession()` server-side and `redirect('/login')` when absent.
- **`proxy.ts`** is an optimistic edge gate: it checks for the Better Auth session cookie (`better-auth.session_token` / `__Secure-…`) and redirects to `/login` if missing — no DB call. Authoritative validation is the page's `getSession()`.
- **`site-header`** (client) uses `useSession()` to switch nav between authed/guest and calls `signOut()`.
- **`auth-login` / `auth-register`** (client features) call `signIn.email` / `signUp.email` via react-hook-form. See [[state-and-forms]].

## Schema

Better Auth tables (`user`, `session`, `account`, `verification`) live in `pkg/db/schema.table.ts` alongside the app tables and are managed by the same Drizzle migrations. See [[database-and-migrations]].

## Env

`BETTER_AUTH_SECRET` (≥32 chars) and `BETTER_AUTH_URL` are server vars; `NEXT_PUBLIC_BETTER_AUTH_URL` / `NEXT_PUBLIC_APP_URL` are public. All via `config/env` — see [[config-and-env]].
