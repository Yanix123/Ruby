# Movie Catalog

A mini full-stack movie catalog: a public movie list and details pages, plus an
authenticated, per-user **favorites** feature.

## Stack

- **Next.js 16** (App Router, React Server Components, Turbopack)
- **Drizzle ORM** + **Supabase Postgres** (type-safe SQL, no `supabase-js`)
- **Better Auth** (email/password, Drizzle adapter)
- **TanStack Query** (optimistic favorites toggle)
- **react-hook-form** (validated auth forms)
- **Tailwind CSS v4**
- **Vitest** (unit) + **Playwright** (e2e)

## Architecture

FSD-inspired layered structure — code may only import **downward**:

```
(web)  → modules → widgets → features → entities → shared → config → pkg
```

- Layers `modules / widgets / features / entities / shared` live under `src/app/`;
  `config` and `pkg` live at `src/`. Path aliases (`@/modules`, `@/entities`, …) map to them.
- `app/(web)` — pages/layouts (thin shells, root layout here); `app/(api)` — route handlers
- `modules/` — page business logic (Server Components orchestrating widgets/features)
- `widgets/` — self-sufficient UI; `features/` — small single-purpose UI
- `entities/` — data: models (`models/`), and `api/<name>/` segments (reads + Server Actions + query/mutation hooks)
- `shared/` — UI primitives; `config/` — env/fonts/styles; `pkg/` — DB, auth, query (no app imports)

Each slice/segment exposes its public API via `index.ts`. Import client code from segment
barrels (e.g. `@/entities/api/favorites`) to avoid pulling `server-only` modules into the client.

## Setup

1. **Install**

   ```bash
   npm install
   ```

2. **Environment** — copy `.env.example` to `.env.local` and fill in:

   | Var | Purpose |
   | --- | --- |
   | `DATABASE_URL` | Supabase **Transaction Pooler** string (port 6543) — runtime, `prepare:false` |
   | `DIRECT_URL` | Supabase **session pooler** (port 5432) — migrations + seed |
   | `BETTER_AUTH_SECRET` | ≥ 32 chars (`openssl rand -base64 32`) |
   | `BETTER_AUTH_URL` | App origin, e.g. `http://localhost:3000` |
   | `NEXT_PUBLIC_BETTER_AUTH_URL` | Same origin, exposed to the browser auth client |

   Env is validated at startup (`src/instrumentation.ts` + `src/config/env/`); a missing/invalid
   var fails fast with a clear message.

3. **Database** — push the schema and seed movies:

   ```bash
   npm run db:generate   # generate SQL migration from src/pkg/db/schema.ts
   npm run db:push       # apply to Supabase
   npm run db:seed       # insert 8 sci-fi movies
   ```

4. **Run**

   ```bash
   npm run dev           # http://localhost:3000  (→ redirects to /movies)
   ```

## Scripts

| Script | Description |
| --- | --- |
| `dev` / `build` / `start` | Next.js dev / production build / serve |
| `db:generate` / `db:push` / `db:seed` | Drizzle migrate + seed |
| `test` / `test:watch` | Vitest unit tests |
| `e2e` | Playwright end-to-end (`npx playwright install chromium` once first) |
| `lint` | ESLint |

## Testing

```
tests/
├── unit/            # Vitest — UUID guard, poster fallback, optimistic-toggle reducer
└── e2e/flows/       # Playwright — full catalog flow
```

- **Unit** (`npm run test`): pure logic, no DB.
- **E2E** (`npm run e2e`): register → favorite a movie → persists across reload → logout
  re-protects `/favorites`. Playwright starts the dev server automatically.

## Definition of Done

1. List renders from Supabase via Drizzle (Server Component)
2. Click → `/movies/[id]` details; missing/malformed id → 404
3. Unauthenticated users are redirected from `/favorites` to `/login` (proxy + server guard)
4. Add/remove favorites persists in the DB across reloads
5. Favorites are private per user (`userId` always derived from the server session)
6. Register/login works; session persists; logout works

## Security note

`/favorites` is protected in two layers: an optimistic cookie check in `src/proxy.ts` and an
authoritative `getSession()` check in the page + every favorites Server Action. Favorite writes
never trust a client-supplied `userId`.
