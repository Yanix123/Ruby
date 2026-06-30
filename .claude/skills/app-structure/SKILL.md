---
name: app-structure
description: Use when placing or scaffolding code in this movie-catalog Next.js app — adding a module/widget/feature, an entity api or model, a shared ui/store/auth file, a route or route handler, deciding where a new file should live, or auditing the app against its Feature-Sliced Design (Layer/Slice/Segment) layout. Trigger even if the user doesn't say "FSD" or "structure" — if they're placing new code in this client repo, use this skill. Skip for one-line edits, copy changes, and refactors inside an existing slice. For *data access* specifics (Drizzle endpoints, TanStack, SSR, auth) see the sibling `data-layer` skill.
---

# app-structure

The canonical architectural pattern for this app — **Next.js 16 (App Router) + React 19** organised by **Feature-Sliced Design (FSD)**: **Layers** (top-level concerns) → **Slices** (one folder per business unit) → **Segments** (named subfolders by purpose). This skill owns *where files live and how they're named*; the `data-layer` skill owns *how data flows*.

`<module>`, `<widget>`, `<feature>`, `<api>`, `<entity>` are placeholders for the unit being built.

## When to use

- Add a Slice to a Layer (module, widget, feature, entity api/model, shared segment file, `pkg/` integration, `(web)` route, `(api)` route handler).
- Decide which layer/segment a new file belongs to.
- Audit layout, naming, barrels, and import direction.

Skip for one-line edits, bug fixes, and refactors *inside* one slice.

## Architecture (as built)

```
src/
├── app/
│   ├── (web)/                      # LAYER — App Router pages (route group)
│   │   ├── layout.tsx              # root layout (RSC): ThemeProvider > QueryProvider > SiteHeader
│   │   ├── page.tsx                # redirect('/movies')
│   │   ├── error.tsx / not-found.tsx   # thin → ErrorModule / NotFoundModule
│   │   ├── login/ register/        # page.tsx → Auth*Module
│   │   ├── movies/(list)/          # page.tsx (force-dynamic) + loading.tsx → MoviesModule
│   │   ├── movies/[id]/            # page.tsx (force-dynamic) + generateMetadata → MovieDetailsModule
│   │   └── favorites/              # page.tsx (getSession guard) + loading.tsx → FavoritesModule
│   ├── (api)/api/                  # LAYER — route handlers (the ONLY place Drizzle runs)
│   │   ├── auth/[...all]/route.ts  # Better Auth (toNextJsHandler)
│   │   ├── movies/route.ts · movies/[id]/route.ts
│   │   └── favorites/route.ts · favorites/movies/route.ts · favorites/[itemId]/route.ts
│   ├── modules/                    # LAYER — page-level business logic (one per page)
│   │   └── <module>/{<module>.module.tsx, <module>.service.ts?, index.ts}
│   ├── widgets/                    # LAYER — self-sufficient composite UI
│   │   └── <widget>/{<widget>.component.tsx, index.ts}
│   ├── features/                   # LAYER — single-purpose capabilities
│   │   └── <feature>/{<feature>.component.tsx, index.ts}
│   ├── entities/                   # LAYER — domain data (no layer-level barrel)
│   │   ├── api/<api>/{<api>.api.ts, <api>.query.ts?, <api>.mutation.ts?, index.ts}
│   │   └── models/{<entity>.model.ts, index.ts}
│   └── shared/                     # LAYER — cross-layer reusable code
│       ├── ui/<name>/{<name>.component.tsx, index.ts}     # text-field, skeleton, movie-card(view)
│       ├── store/{<name>.store.ts, index.ts}              # Zustand global store
│       └── auth/{auth.client.ts, auth.server.ts, index.ts}  # Better Auth (project deviation: auth in shared)
├── config/
│   ├── env/{env.client.ts, env.server.ts, index.ts}       # @t3-oss/env-nextjs (only place reading process.env)
│   ├── fonts/{font.ts, index.ts}                          # next/font
│   └── styles/global.css                                  # Tailwind v4 + shadcn theme
├── pkg/                            # framework integrations / utilities (self-contained, liftable)
│   ├── theme/                      # shadcn: lib/utils (cn), theme.provider, ui/*
│   ├── db/                         # Drizzle: db.client, schema.table, seed.util, index
│   ├── query/                      # TanStack QueryProvider
│   └── lib/                        # pure utils (uuid.util)
└── proxy.ts                        # Next 16 middleware-convention file — guards /favorites by cookie
```

### Layer dependency rule

Imports flow **only downward**:
```
(web) | (api) → modules → widgets → features → entities → shared
```
`config/` and `pkg/` are infra — any layer may import them. Never import upward (entity ↛ feature, feature ↛ widget, module ↛ module).

### Folder discipline

Barrels (`index.ts`) live at **slice/segment level only** — the folder that directly contains implementation files. Layer folders (`modules/`, `widgets/`, `features/`, `entities/`, `shared/`, `pkg/`) ship **no** barrel. Consumers import from the slice/segment, not the layer. Folders are **kebab-case**; the slice folder name matches the file prefix (`modules/movies/movies.module.tsx`).

## Hard rules

1. **Slice/segment barrels only** — every slice/segment ships `index.ts`; layer folders carry none.
2. **One-way imports** — `(web)/(api) → modules → widgets → features → entities → shared`; `config/`+`pkg/` are infra. No upward, no same-layer sibling imports (no module→module).
3. **`pkg/*` self-containment** — a `pkg/*` slot never imports from `app/*` or another `pkg/*`; it must be liftable as one folder. Duplicate a helper rather than cross-import.
4. **RSC by default, `'use client'` at the highest boundary** — pages/layouts/modules stay Server Components unless they need the client runtime (hooks, events, TanStack mutation, Zustand). Add `'use client'` at the outermost component that needs it (here: `favorite-toggle`, auth form components, providers, sonner).
5. **DB only through endpoints; env only through `config/env/`** — Drizzle runs **only** in `(api)/api/**/route.ts`; never read `process.env` outside `config/env/` (except `NODE_ENV`). Full data rules in the `data-layer` skill.

## Layer responsibilities

- **`(web)/`** — App Router pages. Thin: read `params`, guard/redirect, render a `<…>Module`. `force-dynamic` on pages whose module fetches an endpoint at request time (`movies/(list)`, `movies/[id]`); `favorites` is dynamic via `getSession()`.
- **`(api)/api/`** — route handlers; the single home of Drizzle queries and Better Auth. See `data-layer`.
- **`modules/<module>/`** — one slice per page/domain. `<module>.module.tsx` is the entry component (Server Component that `await`s endpoint reads, or a small `'use client'` shell). `<module>.service.ts` is an optional module-scoped server helper (e.g. cookie-forwarding SSR fetch). Modules never import each other.
- **`widgets/<widget>/`** — self-sufficient composite UI (`site-header`, `movie-card`, `favorites-list`). Composes features/shared. RSC unless it needs the client.
- **`features/<feature>/`** — single-purpose capability (`favorite-toggle`, `auth-login`, `auth-register` form components). Small surface.
- **`entities/api/<api>/`** — the resource's client data layer: `<api>.api.ts` (fetch clients to the endpoints), `<api>.query.ts` (`queryOptions` + `useQuery`), `<api>.mutation.ts` (`'use client'` `useMutation`). Movies has only `.api.ts` (SSR-read); favorites has api/query/mutation.
- **`entities/models/`** — types only, one `<entity>.model.ts` per entity (`IMovie`/`IFavorite` via `InferSelectModel`; `ISignInValues`/`ISignUpValues`).
- **`shared/`** — `ui/` (shadcn-based primitives), `store/` (Zustand global), `auth/` (Better Auth client/server — project deviation kept here).
- **`config/`** — `env/` (t3-env gate), `fonts/`, `styles/global.css`.
- **`pkg/`** — `theme` (shadcn), `db` (Drizzle), `query` (provider), `lib` (utils). Self-contained.
- **`proxy.ts`** — edge guard for `/favorites` (cookie presence check). Authoritative session check is server-side in the page.

> Decision trees (which layer / new slice vs extend / which segment / what may import / when to lift) live in `references/structure.md`.

## File naming (suffix = role)

| Suffix | Role | Layer |
|---|---|---|
| `*.module.tsx` | Module entry component | `modules/` |
| `*.component.tsx` | React component | widgets, features, shared/ui |
| `*.service.ts` | Logic helper (no React) | modules, widgets, features, pkg |
| `*.api.ts` | Fetch client to an endpoint | `entities/api/<api>/` |
| `*.query.ts` | TanStack `queryOptions` + `useQuery` | `entities/api/<api>/` |
| `*.mutation.ts` | TanStack `useMutation` (`'use client'`) | `entities/api/<api>/` |
| `*.model.ts` | Domain types | `entities/models/` |
| `*.store.ts` | Zustand store | `shared/store/`, modules/widgets |
| `*.util.ts` | Pure utility | `pkg/lib/`, shared |
| `*.interface.ts` / `*.constant.ts` | Types / static values | any slice, `shared` |
| `*.table.ts` | Drizzle table schema | `pkg/db/` |
| `page/layout/loading/error/not-found.tsx` | Next conventions | `(web)/` |
| `route.ts` | Route handler | `(api)/api/` |
| `proxy.ts` | Next 16 edge middleware file | `src/` root |

## Symbol naming

- Interfaces `I<Name>` (`IProps`, `IMovie`, `IFavorite`); enums `E<Name>`; Zod schemas (if added) `S<Name>`.
- Components PascalCase with role suffix: `<Module>Module`, `<Widget>`/`<Feature>` components; `FC<Readonly<IProps>>`, destructure in body.
- Zustand: `use<Name>Store`. TanStack: `<name>QueryOptions`, `use<Name>` (query), `use<Name>Toggle`/`use<Name>Mutation`.
- Module default export + barrel re-export: `export default <Name>Module` → `export { default as <Name>Module }` OR named `export { <Name>Module }` (this app uses named exports consistently).

## Modes

- **Add a slice** — pick the layer top-down; pull complexity down (reused-by-two-siblings → lift one layer down; type needed by 3+ layers → `entities/models` or `shared`). See `references/structure.md`.
- **Data work** — defer to the `data-layer` skill: add the route handler (Drizzle) first, then the `entities/api` fetcher/query/mutation, then the SSR module or client feature.

## Comments

Short label-style `//` comments above named symbols, 1–5 words. Pages `// page`, modules `// component`, route handlers `// VERB /path`, mutations `// <action>`. Full convention in `references/comments.md`.

## Self-verification

After a change, check `spec/`:
1. `spec/invariants.spec.md` — global invariants (barrels, import direction, pkg self-containment, server/client boundary, DB-only-in-endpoints, env, naming).
2. `spec/per-action.spec.md` — the block matching what you did (`+module`, `+widget/feature`, `+entity`, `+shared`, `+route-handler`).

## Common mistakes

| Mistake | Reality |
|---|---|
| `index.ts` at layer level (`modules/index.ts`) | Forbidden — barrels live at slice/segment level only. |
| Importing upward / module→module | One-way only; lift shared logic down into a feature/widget/shared. |
| `db.select(...)` in a component/module/entities | Drizzle runs only in `(api)/api/**/route.ts`. See `data-layer`. |
| `'use client'` on every leaf | Add at the highest boundary that needs the client runtime. |
| `process.env` outside `config/env/` | Add the var to the Zod schema, import `envClient`/`envServer`. |
| Free-floating domain type in a module | Lift to `entities/models/<entity>.model.ts`. |
| `pkg/<name>` importing `app/*` | `pkg/*` is self-contained and liftable; duplicate helpers. |

The *why* behind each rule lives in `references/pitfalls.md`.

## Resources

This SKILL is the router; the resource sets are independent and do **not** reference one another.

| Situation | Open |
|---|---|
| Deciding **where new code goes** | `references/structure.md` |
| **Verifying** after a change | `spec/invariants.spec.md` + matching block in `spec/per-action.spec.md` |
| Understanding **why** a rule exists | `references/pitfalls.md` |
| **Comment style** | `references/comments.md` |
| **Data access** (Drizzle/endpoints/TanStack/auth) | sibling skill `data-layer` |
