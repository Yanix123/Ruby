# Per-action checks

Run the block matching what you did, plus `invariants.spec.md`.

## +module
- MUST: `src/app/modules/<m>/<m>.module.tsx` + `index.ts` exist; folder == prefix.
- MUST: the module is a Server Component unless it needs the client runtime; if it reads data it `await`s an `entities/api/<api>` fetcher (not Drizzle).
- MUST: mounted from a thin `(web)/.../page.tsx`; page is `force-dynamic` if the module fetches an endpoint at request time.
- MUST NOT: import another module; contain `db.*`.

## +widget / +feature
- MUST: `<name>.component.tsx` + `index.ts`; composes only layers below.
- MUST: `'use client'` only if it uses hooks/events/mutations.
- MUST NOT: feature import a widget; widget import a module.

## +entity (api and/or model)
- MUST: model `entities/models/<entity>.model.ts` exports types only; table imported as `import type`.
- MUST: api slice `entities/api/<api>/` has `<api>.api.ts` (fetch client to the endpoint) + `index.ts`; add `.query.ts` (`queryOptions`+`useQuery`) / `.mutation.ts` (`'use client'` `useMutation`) only if a client needs them.
- MUST NOT: any Drizzle in `entities/api` — the matching `(api)/api/.../route.ts` owns it (see `data-layer`).

## +shared
- MUST: pick the segment (`ui/`, `store/`, `auth/`) and matching suffix (`.component.tsx`, `.store.ts`, `auth.client/server.ts`); re-export from the segment/slice `index.ts`.
- MUST: `shared/auth/index.ts` exports client symbols only; server instance via `@/shared/auth/auth.server`.
- MUST NOT: import any `app/*` layer.

## +route-handler  (also read `data-layer` spec)
- MUST: `src/app/(api)/api/<route>/route.ts` exports `GET`/`POST`/`DELETE`/...; Drizzle + `auth.api.getSession` live here.
- MUST: validate input (uuid guard, body shape); 401 when session required and absent; userId from session, never the body.
- MUST: the matching `entities/api/<api>/<api>.api.ts` fetch client points at this route.

## +pkg
- MUST: `src/pkg/<name>/` self-contained with `index.ts`; reads config via `envClient`/`envServer`.
- MUST NOT: import `app/*` or another `pkg/*`.
