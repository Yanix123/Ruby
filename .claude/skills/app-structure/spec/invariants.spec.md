# Invariants — always true

Each item is a MUST / MUST NOT with a Check hint (grep/visual). Confirm all before declaring work done.

## Barrels & folders
- MUST: every slice/segment that contains implementation files has an `index.ts`.
  - Check: `ls src/app/modules/<m>/index.ts`, etc.
- MUST NOT: a layer folder has a barrel.
  - Check: `ls src/app/{modules,widgets,features,entities,shared,pkg}/index.ts` → all "No such file".
- MUST: folders are kebab-case; slice folder name == file prefix.

## Import direction
- MUST NOT: import upward or a same-layer sibling.
  - Check (module→module): `grep -rn "@/modules/" src/app/modules` → empty.
  - Check (entity→feature/widget/module): `grep -rnE "@/(features|widgets|modules)/" src/app/entities` → empty.
- MUST: `pkg/*` imports nothing from `app/*` or another `pkg/*`.
  - Check: `grep -rnE "@/(app|modules|widgets|features|entities|shared)/" src/pkg` → empty; `grep -rn "@/pkg/" src/pkg` → only intra-slice relative, no cross-pkg alias.

## Data & server/client boundary
- MUST: Drizzle runs only in route handlers.
  - Check: `grep -rnE "db\.(select|insert|update|delete)|drizzle\(" src --include=*.ts | grep -v "(api)/api" | grep -v "pkg/db"` → empty.
- MUST: `'use client'` only where the client runtime is needed; pages/layouts/read-modules are RSC.
  - Check: `grep -rln "'use client'" src/app` → providers, auth form components, `favorite-toggle`, sonner only.
- MUST: `*.mutation.ts` declares `'use client'`; `*.api.ts` / `*.query.ts` do not.

## Env
- MUST NOT: read `process.env` outside `config/env/` (except `NODE_ENV`).
  - Check: `grep -rn "process.env" src --include=*.ts | grep -v "config/env" | grep -v "NODE_ENV"` → empty.

## Naming
- MUST: files use role suffixes; only Next convention files (`page/layout/loading/error/not-found/route/proxy`) are suffix-less.
- MUST: interfaces `I<Name>`, enums `E<Name>`, stores `use<Name>Store`, query factories `<name>QueryOptions`.
- MUST: `entities/models/*.model.ts` import the table as `import type` only.
  - Check: `grep -rn "from '@/pkg/db/schema.table'" src/app/entities/models` → all `import type`.

## Layer purity
- MUST: `page.tsx` is thin — reads params/guards and renders a module; no business logic.
- MUST: `shared/*` imports only `config`/`pkg`.
- MUST: `entities/models/*` contain types only (no runtime exports).
