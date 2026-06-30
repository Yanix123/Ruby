# Pitfalls — the *why* behind the rules

## Barrels at slice/segment level only
A layer-level barrel (`modules/index.ts`) tempts cross-slice re-exports, which create import cycles and hide the dependency graph. Keeping barrels at the slice/segment makes each unit's public surface explicit and its internals private.

## One-way imports, no same-layer siblings
The downward rule (`(web)→modules→widgets→features→entities→shared`) keeps the dependency graph acyclic and makes any unit liftable/testable in isolation. A module importing another module couples two page domains; the fix is to lift the shared part down into a feature/widget. A feature importing a widget inverts the hierarchy — the feature is then really part of that widget.

## `pkg/*` self-containment
`pkg/theme`, `pkg/db`, `pkg/query`, `pkg/lib` are integrations meant to be liftable as one folder into another project. If a pkg imports `app/*` it's no longer liftable and leaks app concerns into infra. If two pkg slots need the same helper, duplicate the private file — a shared helper between pkgs would re-introduce coupling.

## RSC by default, `'use client'` at the highest boundary
Sprinkling `'use client'` on leaves ships unnecessary JS and forces parents to become client too. Put it once, at the outermost component that genuinely needs the client runtime. In this app the client boundaries are: providers (`ThemeProvider`, `QueryProvider`, sonner), the auth form components, and `favorite-toggle`. Pages, layouts, and the read modules stay Server Components.

## DB only through endpoints (and read in SSR)
Drizzle queries live exclusively in `(api)/api/**/route.ts`. Components and modules read those endpoints; they never `import { db }`. This keeps one DB access boundary (easy to audit, secure, and to attach auth), and lets the Server Components render initial HTML by `await`ing the endpoint. The detail rationale and the self-fetch/`force-dynamic` mechanics are in the `data-layer` skill — but structurally: a `db.select(...)` outside a route handler is a layering violation.

## Env through `config/env/` only
Reading `process.env` ad hoc loses validation and the client/server split that `@t3-oss/env-nextjs` enforces. The one allowed bare read is `process.env.NODE_ENV` (framework flag, e.g. in the Zustand devtools guard). Everything else goes through `envClient` / `envServer`.

## Models are types, not runtime
`entities/models/*.model.ts` use `InferSelectModel<typeof table>` — a **type-only** import from `pkg/db/schema.table`. They must not pull Drizzle runtime, or a client bundle importing a model would drag in `postgres`. Keep the import `import type`.

## `shared/auth` placement (deliberate deviation)
A strict reading of the FSD guide would put a third-party integration like Better Auth in `pkg/`. This project keeps it in `src/app/shared/auth` by explicit decision. The barrel `@/shared/auth` exports **client-only** symbols; the server instance + `getSession` are imported via `@/shared/auth/auth.server` so a client component never pulls `server-only` + Drizzle.

## `proxy.ts`, not `middleware.ts` (Next 16)
Next 16 renamed the middleware-file convention to `proxy`. The file is `src/proxy.ts` exporting `proxy`. It does only an optimistic cookie-presence check for `/favorites`; the authoritative session check is server-side `getSession()` in the page.

## Naming drift
Folders are kebab-case and the slice folder name equals the file prefix (`movies/movies.module.tsx`). Symbol prefixes (`I`/`E`/`S`) and role suffixes (`.module/.component/.api/.query/.mutation/.model/.service/.util/.store`) are how the layer of a file is read at a glance — a suffix-less file (outside Next conventions) hides its role.
