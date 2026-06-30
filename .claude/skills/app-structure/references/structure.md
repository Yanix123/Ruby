# Structure — where does this code go?

Decision guide at three granularities: **Layer** (which top-level concern), **Slice** (new slice vs extend), **Segment** (which bucket inside a slice/shared). Each part gives a decision tree + isolation rules.

## Part A — Layer

Top-down: ask the first question that matches.

```
Is it a URL (page/layout/loading/error/not-found)?            → (web)/
Is it an HTTP endpoint (DB query, auth, webhook)?             → (api)/api/<route>/route.ts
Is it the top-level logic/composition for one page/domain?    → modules/<module>/
Is it self-sufficient composite UI reused across pages?       → widgets/<widget>/
Is it a small single-purpose capability?                      → features/<feature>/
Is it a resource's data access (fetch + query/mutation)?      → entities/api/<api>/
Is it a domain type/shape?                                    → entities/models/<entity>.model.ts
Is it reusable UI / global store / auth client?               → shared/{ui,store,auth}/
Is it env/fonts/global styles?                                → config/
Is it a framework integration or pure util?                   → pkg/{theme,db,query,lib}/
```

### Layer isolation

| Layer | May import | Must NOT import | When to lift |
|---|---|---|---|
| `(web)` | everything below + config/pkg | — | logic out of `page.tsx` into a module |
| `(api)` | entities, shared, config, pkg | modules/widgets/features | — |
| `modules` | widgets, features, entities, shared, config, pkg | `(web)`, another module | reused-by-2-modules logic → feature/widget |
| `widgets` | features, entities, shared, config, pkg | modules, another widget | — |
| `features` | entities, shared, config, pkg | widgets, modules, another feature | — |
| `entities` | shared, config, pkg | features/widgets/modules | — |
| `shared` | config, pkg | any `app/*` layer | — |
| `config` / `pkg` | (pkg: external only) | any `app/*` layer | — |

**Lift-down test:** a symbol needed by 3+ layers → `entities/models` (domain shape) or `shared/interfaces` (cross-cutting). Logic reused by two same-layer siblings → drop one layer down (module logic shared by two modules → feature or widget).

**Commonly confused:**
- **module vs widget** — a module is page-scoped (one per route/domain, orchestrates); a widget is reusable composite UI with no page concerns.
- **widget vs feature** — a feature is single-purpose and small; once it composes multiple features it's a widget.
- **route handler vs module** — DB access and auth belong in `(api)` route handlers; the module only *reads* them (see `data-layer`).

## Part B — Slice

**New slice vs extend:** if the unit is a new page/domain/resource/reusable UI piece → new slice folder. If it's a variation of an existing slice → extend that slice (add a private file or an `elements/` sub-component), don't make a sibling.

**Slice isolation:**
- Import a slice **only through its `index.ts`** — never reach into a sibling's internal files.
- Slice folder name (kebab-case) == file prefix (`movies/movies.module.tsx`).
- One public surface per slice via the barrel; internal helpers stay unexported.
- **No same-layer sibling imports** — module↛module, widget↛widget, feature↛feature. Shared need → lift down.
- Module-private sub-components live under `modules/<module>/elements/<element>/` with their own barrel.

## Part C — Segment

Segments are the typed buckets inside a slice or inside `shared`/`config`/`entities`.

- **entities/api/`<api>`** — `<api>.api.ts` (fetch client), `<api>.query.ts` (`queryOptions`+`useQuery`), `<api>.mutation.ts` (`'use client'` `useMutation`). Only add the files the resource needs (movies: `.api` only; favorites: all three).
- **entities/models** — flat `<entity>.model.ts`, types only, no runtime code.
- **shared/ui/`<name>`** — one folder per primitive, `<name>.component.tsx` + barrel.
- **shared/store** — `<name>.store.ts` (`use<Name>Store`).
- **shared/auth** — `auth.client.ts` (client hooks), `auth.server.ts` (`'server-only'` Better Auth instance + `getSession`), barrel re-exports client only.
- **config/env** — `env.client.ts` / `env.server.ts`; the only files allowed to read `process.env`.
- **pkg/`<name>`** — self-contained integration; `theme` (shadcn ui + `cn`), `db` (Drizzle client/schema/seed), `query` (provider), `lib` (pure utils).

**Purity rules:**
- A `*.util.ts` has no framework/I/O/service calls — it runs with no runtime. A util that calls a service is a service.
- A `*.constant.ts` imports no runtime code — split if it does.
- `entities/models` (types) never imports `pkg/db` runtime — only `InferSelectModel<typeof table>` type imports from `pkg/db/schema.table`.
- `shared` never imports an `app/*` layer; if tempted, the thing isn't shared.
