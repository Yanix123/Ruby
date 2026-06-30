# Codebase Wiki — movie-catalog

A single **Next.js 16 (App Router)** full-stack app: a movie catalog with a public list and detail pages, and per-user **favorites** behind authentication. Data lives in **Supabase Postgres**, accessed via **Drizzle ORM** — and only through **route-handler endpoints**, which the pages read in **SSR**. Auth is **Better Auth**; client cache/mutations use **TanStack Query**; forms use **react-hook-form**; UI is **Tailwind v4 + shadcn**.

| Concern | Tech |
|---|---|
| Framework | Next.js 16 · React 19 · TypeScript |
| Data / ORM | Supabase Postgres · Drizzle ORM + drizzle-kit |
| Auth | Better Auth (Drizzle adapter) |
| Client data | TanStack Query (+ optimistic) · `fetch` clients |
| Forms | react-hook-form |
| UI | Tailwind v4 · shadcn (`pkg/theme`) · next-themes · sonner |
| State | Zustand (`shared/store`) |
| Tooling | Yarn 1.22.22 · ESLint 9 · Prettier · Vitest · Playwright |

Architecture follows **Feature-Sliced Design** (Layer → Slice → Segment), governed by the skills under `.claude/skills/` — see [[conventions-and-skills]].

## Architecture at a glance

```
src/
  app/
    (web)/        pages → modules (thin shells)
    (api)/api/    route handlers — the ONLY place Drizzle runs
    modules/      one slice per page (movies, movie-details, favorites, auth-*, not-found, error)
    widgets/      composite UI (site-header, movie-card, favorites-list)
    features/     favorite-toggle, auth-login, auth-register
    entities/     api/<resource> (fetch + query + mutation) · models/<entity>.model.ts
    shared/       ui/ · store/ · auth/ (Better Auth — project deviation)
  config/         env/ · fonts/ · styles/global.css
  pkg/            theme (shadcn) · db (Drizzle) · query (provider) · lib (utils)
  proxy.ts        Next 16 edge guard for /favorites
```

Request shape: **Server Component → `entities/api` fetch client → `(api)` route handler → Drizzle → Postgres**; favorites writes go **client `useMutation` → endpoint**. Detail in [[data-flow]].

## Pages

### Concepts
- [[architecture]] — the single-app shape, FSD layout, runtime model, and the deliberate deviations (DB-through-endpoints-in-SSR, `proxy.ts`, `shared/auth`).
- [[layers]] — every FSD layer and what lives in it.
- [[routing]] — the URL surface: `(web)` pages, `(api)` route handlers, `proxy.ts` guard, dynamic rendering.
- [[data-flow]] — end-to-end read (SSR via endpoints) and write (optimistic mutation) lifecycles.
- [[auth]] — Better Auth: `/api/auth/[...all]`, `shared/auth` client/server, session in endpoints, `/favorites` guard.
- [[database-and-migrations]] — Drizzle schema, Supabase pooling, `drizzle-kit` generate/push, seed.
- [[conventions-and-skills]] — FSD, naming, and the `.claude/skills` + `fsd-architect` agent that enforce them.

### Areas
- [[ui-and-styling]] — Tailwind v4, the shadcn `pkg/theme`, fonts, dark mode, toasts.
- [[state-and-forms]] — TanStack Query (queries/mutations/optimistic), Zustand, react-hook-form.
- [[config-and-env]] — typed env via `@t3-oss/env-nextjs`, fonts, global styles.
- [[testing]] — Vitest unit tests and the Playwright e2e flow.

---

*This wiki is maintained per [[AGENTS]]. Pages cross-link with `[[wikilinks]]`; every claim is grounded in the actual source under `src/`.*
