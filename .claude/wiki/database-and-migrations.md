# Database & migrations

**Supabase Postgres** via **Drizzle ORM**. All DB code lives in `src/pkg/db/`; all *queries* live in `(api)/api/**/route.ts` (see [[data-flow]]).

## `pkg/db/`

- **`db.client.ts`** — `drizzle(postgres(envServer.DATABASE_URL, { prepare: false }), { schema })`. `prepare:false` is **required** for the Supabase Transaction Pooler (no prepared statements).
- **`schema.table.ts`** — Drizzle tables:
  - Better Auth: `user`, `session`, `account`, `verification` (+ relations).
  - App: `items` (movies: `id` uuid PK, `title`, `description`, `image_url`, `created_at`) and `favorites` (`id` uuid PK, `user_id` → `user.id`, `item_id` → `items.id`, `created_at`, **unique `(user_id, item_id)`** so a movie can't be favorited twice).
- **`seed.util.ts`** — standalone script seeding the `items` table (loads `.env.local` via dotenv, uses the session pooler). Run with `yarn db:seed`.
- **`index.ts`** — exports `db` only; tables are imported from `@/pkg/db/schema.table`.

## Pooling (Supabase)

- `DATABASE_URL` — Transaction Pooler (port 6543), used at runtime.
- `DIRECT_URL` — Session pooler (port 5432), used for migrations + seed.

## drizzle-kit

`drizzle.config.ts` points at `./src/pkg/db/schema.table.ts`, output `./drizzle`, dialect `postgresql`, credentials `DIRECT_URL ?? DATABASE_URL` (loads `.env.local`). Commands:

- `yarn db:generate` — generate SQL from the schema into `drizzle/`.
- `yarn db:push` — apply to the database.
- `yarn db:seed` — seed movies.

## Types

`entities/models/{movie,favorite}.model.ts` derive `IMovie` / `IFavorite` from the schema with `InferSelectModel<typeof items|favorites>` via **`import type`** (no runtime pull into client bundles). Over HTTP, `created_at` serializes to an ISO string (unused in the UI).

See [[auth]] (shared tables), [[config-and-env]] (env), [[data-flow]] (where queries run).
