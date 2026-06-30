---
name: git-workflow
description: "Git workflow, branching strategy, and commit message format for movie-catalog. Use PROACTIVELY whenever making commits, creating branches, opening PRs, merging, resolving conflicts, or any git operation. Trigger when the user asks about commit format, branch naming, PR process, or release/hotfix flow — even if they don't say 'git' explicitly."
---

# Git Workflow Guide

## Commit Message Format

```
[action]: [short imperative subject]

[file/area]: [what changed]
[file/area]: [what changed]
```

### Action types

- **feat** — new feature/file/component
- **fix** — bug fix
- **docs** — documentation
- **style** — formatting only (no code behavior)
- **refactor** — production-code refactor, renames
- **test** — add/modify tests
- **chore** — build tasks, deps, config
- **perf** — performance
- **ci** — CI/CD config
- **build** — build system / dependencies
- **revert** — revert a previous commit

### Examples (this project)

```
feat: add favorites endpoint and optimistic toggle

api/favorites/route.ts: add GET/POST handlers (session-scoped, Drizzle)
entities/api/favorites/favorites.mutation.ts: optimistic useFavoriteToggle
features/favorite-toggle/favorite-toggle.component.tsx: wire mutation + session
```

```
fix: guard malformed movie id before uuid query

api/movies/[id]/route.ts: return 404 when id is not a uuid
pkg/lib/uuid.util.ts: isUuid helper
```

```
chore: switch package manager to yarn 1.22.22

package.json: add engines/volta/packageManager
```

### Best practices

- Imperative mood: "add" not "added".
- Subject under ~50 chars, capitalize the action's first letter is optional but be consistent; no trailing period.
- One logical change per commit (atomic).
- Commit messages and code comments in **English**.
- Never commit secrets — `.env.local` is git-ignored; only `.env.example` is committed.
- End AI-authored commit bodies with the project's co-author trailer if configured.

## Branch model (trunk-based)

Permanent branches, never deleted:

- **`main`** — production. PR-only, requires review + green checks. Merges from `staging`.
- **`staging`** — pre-prod testing. Merges from `develop` and hotfixes. Promotes to `main`.
- **`develop`** — integration. Merges from feature/fix branches. Promotes to `staging`.

Working branches (lowercase, kebab-case, no special chars; delete after merge):

- `feature/<short-description>` — off `develop` (e.g. `feature/favorites-pagination`).
- `fix/<short-description>` — off `develop` (e.g. `fix/login-validation`).
- `hotfix/<short-description>` — off `main`, merged back to **both** `main` and `develop`.

## Workflows

**Feature/fix:** branch off `develop` → commit → push → PR to `develop` → review + green checks (`yarn type-check`, `yarn lint`, `yarn test`, `yarn build`) → merge → delete branch.

**Release:** `develop` → `staging` (test) → PR `staging` → `main` → deploy.

**Hotfix:** branch off `main` → fix → PR to `main` (urgent) → also PR to `develop` to resync → delete branch.

## Rules

- No direct pushes to `main` / `staging` / `develop`; PR + ≥1 approval + passing checks.
- Keep branches up to date with the parent; resolve conflicts locally and re-test.
- Reference issues when applicable: `fix: resolve login error (#123)`.
- Required green before merge: TypeScript, ESLint, unit tests, and a successful `next build`.
