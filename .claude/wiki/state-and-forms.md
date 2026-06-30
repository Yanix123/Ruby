# State & forms

## TanStack Query

- **Provider** — `pkg/query/QueryProvider` (`QueryClientProvider` with a per-mount `QueryClient`), mounted in the root layout under `ThemeProvider`.
- **Queries/mutations** live in `entities/api/<api>/`. Only **favorites** is client-interactive:
  - `favorites.query.ts` — `FAVORITES_KEY`, `favoritesQueryOptions`, `useFavorites()` (GET `/api/favorites`).
  - `favorites.mutation.ts` — `'use client'` `useFavoriteToggle(movieId)`: optimistic `toggleFavorite` on `FAVORITES_KEY` in `onMutate`, rollback in `onError`, `invalidateQueries` in `onSettled`.
- **Movies** are SSR-read (no client query) — see [[data-flow]].
- `toggleFavorite` is a pure, unit-tested cache transform (see [[testing]]).

## Zustand

`shared/store/global.store.ts` exposes `useGlobalStore` (with `devtools` in dev) for global UI state. It's the canonical place for cross-component client state; reach for it instead of prop-drilling UI flags.

## Forms (react-hook-form)

`features/auth-login` and `features/auth-register` are `'use client'` components using `useForm<ISignInValues|ISignUpValues>` (types from `entities/models/auth.model.ts`). They render `shared/ui/text-field` (passing `error={errors.x?.message}`) and submit via Better Auth client (`signIn.email` / `signUp.email`), surfacing root errors and redirecting on success. Validation: required, email pattern, min password length. See [[auth]].

See [[ui-and-styling]], [[data-flow]].
