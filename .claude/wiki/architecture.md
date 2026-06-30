# Architecture

## Purpose

A single **Next.js 16 App Router** application — not a monorepo. One `package.json`, one `src/`, deployed as one Next app. It implements the homework spec: public movie **list** and **detail**, per-user **favorites** behind auth, `login`/`register`, a Better Auth route handler, and `proxy.ts` protecting `/favorites`.

## Shape

```
Ruby/
  src/
    app/          FSD layers + Next route groups
    config/       env / fonts / styles
    pkg/          theme (shadcn) · db (Drizzle) · query · lib
    proxy.ts      Next 16 edge middleware-convention file
  drizzle/        generated SQL migrations
  drizzle.config.ts
  components.json (shadcn)  next.config.ts  tsconfig.json  eslint.config.mjs  .prettierrc
  tests/          unit/ (vitest) · e2e/ (playwright)
```

Toolchain: **Node 22.x**, **Yarn 1.22.22** (`packageManager` + `volta`), ESLint 9 (flat config + simple-import-sort + prettier), Prettier (single quotes, no semicolons, 120 cols). See [[config-and-env]].

## FSD layout

Domain code under `src/app/` as Feature-Sliced Design layers; `config/` and `pkg/` are hoisted infra. Full per-layer detail in [[layers]].

```
app/
  (web)/      pages (thin) → modules
  (api)/api/  route handlers — the only DB access point
  modules/    one slice per page
  widgets/    composite UI
  features/   single-purpose capabilities
  entities/   api/<resource> · models/<entity>
  shared/     ui · store · auth
```

Imports flow one way: `(web)/(api) → modules → widgets → features → entities → shared`; `config/`+`pkg/` importable anywhere. Enforced by the [[conventions-and-skills]] skills.

## Runtime model

- **Pages are thin Server Components** that render a `<…>Module`. Reads happen in the module by `await`ing an `entities/api` fetch client, which hits an `(api)` route handler that runs Drizzle. See [[data-flow]].
- **`movies/(list)` and `movies/[id]` are `force-dynamic`** — they fetch endpoints at request time, so they're server-rendered on demand (and not prerendered at build).
- **`/favorites` is dynamic** via `getSession()`; `proxy.ts` does an optimistic cookie check at the edge.
- **The only client components** are the providers (`ThemeProvider`, `QueryProvider`, sonner `Toaster`), the auth form components, and `favorite-toggle` (live state + optimistic mutation).
- **`next build` succeeds without a database** — dynamic pages aren't prerendered and `/api/*` are runtime-only; the DB is only hit at request time.

## Deliberate deviations (read before "fixing")

- **DB access only through endpoints, read in SSR.** Next's more idiomatic approach is reading Drizzle directly in Server Components + Server Actions for writes. This project funnels all DB access through `(api)` route handlers and consumes them in SSR by explicit decision. See [[data-flow]].
- **`shared/auth`** holds Better Auth (client + server) rather than `pkg/` — explicit project choice. See [[auth]].
- **`src/proxy.ts`** (export `proxy`), not `middleware.ts` — Next 16 renamed the middleware-file convention.

## Depends on / talks to

- [[layers]] · [[routing]] · [[data-flow]] · [[auth]] · [[database-and-migrations]]
- [[ui-and-styling]] · [[state-and-forms]] · [[config-and-env]] · [[testing]] · [[conventions-and-skills]]
