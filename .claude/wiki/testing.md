# Testing

## Unit (Vitest)

- Location: `tests/unit/*.spec.ts`; config `vitest.config.ts` (node env, `@/*` aliases mirrored from tsconfig).
- Coverage: pure logic — `toggleFavorite` (optimistic cache transform), `posterUrl` (poster fallback), `isUuid` (`pkg/lib`).
- Note: the favorites barrel transitively imports the `'use server'` actions, so `vitest.config.ts` aliases **`server-only`** to a stub (`tests/stubs/server-only.ts`) and sets dummy `DATABASE_URL` / `BETTER_AUTH_SECRET` / `BETTER_AUTH_URL` so env-validated modules import cleanly in Node. The tests themselves exercise only pure functions.
- Run: `yarn test` (or `yarn test:watch`).

## E2E (Playwright)

- Location: `tests/e2e/flows/*.e2e.spec.ts`; config `playwright.config.ts` (chromium, `baseURL http://localhost:3000`, auto-starts `yarn dev`).
- Flow: register → favorite a movie → verify persistence → sign out.
- Requires a running app **and a real Supabase `.env.local`** (DB + auth). Run: `yarn e2e`.

## Green bar

`yarn type-check` (0 errors) · `yarn lint` (0 errors) · `yarn test` (unit) · `yarn build` compiles. The DB-dependent paths (`build` prerender of dynamic data, `db:seed`, `e2e`) need `.env.local`. See [[config-and-env]], [[conventions-and-skills]].
