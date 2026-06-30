# Data flow

**One rule:** the database is reached only through `(api)/api/**/route.ts` (Drizzle), and reads are consumed in SSR. Components never `import { db }`. The `data-layer` skill is the authoritative spec; this page is the narrative.

## Read lifecycle (SSR via endpoint)

```
/movies (page, force-dynamic, RSC)
  └─ <MoviesModule/>  (Server Component)
       └─ await listMovies()                    // entities/api/movies/movies.api.ts
            └─ fetch `${NEXT_PUBLIC_APP_URL}/api/movies`
                 └─ GET /api/movies (route handler)
                      └─ db.select().from(items).orderBy(desc(created_at))   // Drizzle → Postgres
       renders <MovieCard/> grid (server HTML)
```

- **Movie detail** is the same with `getMovieById(id)` → `GET /api/movies/[id]` (uuid-guard, 404). `generateMetadata` also calls `getMovieById` for the `<title>`.
- **Favorites page**: the page guards with `getSession()`; `FavoritesModule` (RSC) calls `modules/favorites/favorites.service.ts#getFavoriteMovies`, which fetches `GET /api/favorites/movies` **forwarding the request cookies** (`headers: await headers()`) so the endpoint resolves the session and returns that user's movies.

## Write lifecycle (client, optimistic)

```
favorite-toggle ('use client')
  ├─ useFavorites()              // useQuery → GET /api/favorites  (current state)
  └─ useFavoriteToggle(movieId)  // useMutation
       mutationFn: isFav ? removeFavorite : addFavorite   // DELETE / POST /api/favorites
       onMutate:   cancel + optimistic toggleFavorite(prev) on FAVORITES_KEY
       onError:    rollback to prev
       onSettled:  invalidateQueries(FAVORITES_KEY)
```

`addFavorite`/`removeFavorite`/`listFavorites` are `fetch` clients in `entities/api/favorites/favorites.api.ts` with `credentials:'include'` so the browser sends the session cookie. The endpoints derive `userId` from the session — never from the body.

## Why this shape

- **Single DB boundary** — every query is in one place (`(api)/api`), easy to audit and secure, and the natural spot to attach auth.
- **SSR initial render** — pages return server HTML by awaiting the endpoint; only the interactive favorite control is client-side.
- **Build-safe** — dynamic pages + runtime-only API routes mean `next build` never touches the DB.

### Trade-off / deviation
A Server Component fetching its own app's `/api/*` (self-fetch) is not Next's idiomatic best practice — the idiomatic alternative is reading Drizzle directly in RSC + Server Actions for writes. This project chose endpoints-in-SSR deliberately; keep it unless the decision changes.

See [[auth]], [[database-and-migrations]], [[state-and-forms]], and the `data-layer` skill.
