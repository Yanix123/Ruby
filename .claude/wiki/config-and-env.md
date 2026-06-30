# Config & env

`src/config/` holds env, fonts, and global styles. The **only** place `process.env` is read is `config/env/` (except the framework `NODE_ENV` flag).

## `config/env/` (typed via `@t3-oss/env-nextjs`)

- **`env.server.ts`** — `createEnv({ server: { DATABASE_URL, DIRECT_URL?, BETTER_AUTH_SECRET (≥32), BETTER_AUTH_URL } })` → `envServer`.
- **`env.client.ts`** — `createEnv({ client: { NEXT_PUBLIC_APP_URL?, NEXT_PUBLIC_BETTER_AUTH_URL? } })` → `envClient`.
- **`index.ts`** — re-exports both. Consumers import `envServer` / `envClient`; never `process.env`.

`.env.example` (committed) documents all keys; `.env.local` (git-ignored) holds the real Supabase + secret values. Validation fails fast at startup on missing/invalid vars.

## `config/fonts/`

`font.ts` declares Geist Sans/Mono via `next/font/google`, exported as `geistSans` / `geistMono`; their CSS variables are applied on `<html>` in the root layout and mapped to `--font-sans` / `--font-mono` in `global.css`.

## `config/styles/global.css`

Tailwind v4 entry + `tw-animate-css` + the shadcn theme variables. See [[ui-and-styling]].

## Toolchain config (project root)

`next.config.ts` (remote image pattern for `placehold.co`, `turbopack.root` pinned to the project), `tsconfig.json` (`@/*` path aliases for every layer), `eslint.config.mjs` (flat config + `simple-import-sort` + `prettier`), `.prettierrc` (single quotes, no semicolons, 120 cols), `components.json` (shadcn), `drizzle.config.ts` (see [[database-and-migrations]]). Node 22.x, Yarn 1.22.22.

See [[auth]], [[database-and-migrations]].
