# Conventions & skills

The governance layer. `CLAUDE.md` holds only generic engineering principles; the architecture and data rules live in `.claude/skills/` and this wiki.

## Feature-Sliced Design

Layer → Slice → Segment. Imports flow one way (`(web)/(api) → modules → widgets → features → entities → shared`; `config/`+`pkg/` infra). Barrels at slice/segment level only. Full layer map in [[layers]] and [[architecture]].

## Naming

- **Files (suffix = role):** `*.module.tsx`, `*.component.tsx`, `*.service.ts`, `*.api.ts`, `*.query.ts`, `*.mutation.ts`, `*.model.ts`, `*.store.ts`, `*.util.ts`, `*.interface.ts`, `*.constant.ts`, `*.table.ts`. Next conventions (`page/layout/loading/error/not-found/route/proxy`) are suffix-less.
- **Symbols:** interfaces `I<Name>`, enums `E<Name>`, Zod schemas `S<Name>`, stores `use<Name>Store`, query factories `<name>QueryOptions`, mutation hooks `use<Name>Toggle`/`use<Name>Mutation`.
- **Folders:** kebab-case; slice folder name == file prefix.
- **Code style:** Prettier — single quotes, no semicolons, 120 cols, trailing commas; ESLint 9 flat config with `simple-import-sort` + `prettier`. Comments are short label-style `//` (see the `app-structure` skill's `references/comments.md`).

## Skills (`.claude/skills/`)

| Skill | Use for |
|---|---|
| `app-structure` | Where a file goes; layer/slice/segment placement; naming; barrels; import direction. Router `SKILL.md` + `references/` (structure, comments, pitfalls) + `spec/` (invariants, per-action). |
| `data-layer` | How data flows: Drizzle-in-endpoints, `entities/api` fetchers, TanStack queries/mutations, SSR reads, Better Auth, `proxy.ts`. |
| `git-workflow` | Commit message format, branch model, PR/release/hotfix flow. |

The `fsd-architect` **agent** (`.claude/agents/`) is the guardian that applies these skills when placing or auditing code, and runs the audits (no DB outside endpoints, no `process.env` outside `config/env`, type-check/lint clean).

## Verification bar

`yarn type-check` (0), `yarn lint` (0 errors), `yarn test`, `yarn build` compiles. DB-dependent paths (`build` prerender of dynamic data, `db:seed`, Playwright e2e) need a real Supabase `.env.local`.

## Deliberate deviations

- DB access only through `(api)` endpoints, read in SSR (not direct Drizzle-in-RSC + Server Actions).
- `shared/auth` holds Better Auth (not `pkg/`).
- `src/proxy.ts` (Next 16), not `middleware.ts`.

See [[architecture]], [[layers]], [[data-flow]].
