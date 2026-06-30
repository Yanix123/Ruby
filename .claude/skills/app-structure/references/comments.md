# Comment style

Short, label-style `//` comments sit **above** a named symbol and expand on the identifier in **1–5 words**. They name the role, not the mechanics. Code that's self-evident gets no comment.

## Per file type

- **Pages** — `// page` above the default export.
- **Layouts** — `// layout`.
- **Modules / components** — `// component` above the `FC`.
- **Route handlers** — the HTTP verb + path: `// GET /api/movies`, `// POST /api/favorites`.
- **Fetch clients** (`*.api.ts`) — the endpoint: `// GET /api/favorites/movies`.
- **Query/mutation** — the action: `// favorites query factory`, `// optimistic add/remove`.
- **Services / utils** — the job: `// session-forwarding SSR read`, `// uuid guard`.
- **Interfaces** — `// interface` above `interface IProps`.

## Rules

- One line, lowercase, no trailing period.
- Above the symbol, never trailing on the same line for declarations.
- Explain **why** only when non-obvious (e.g. `// prepare:false required for the Supabase transaction pooler`). Don't narrate the obvious (`// loop over movies`).
- English only.

## Anti-patterns

- Block/JSDoc banners for ordinary components.
- Restating the identifier (`// MoviesModule component` above `MoviesModule`).
- Commented-out code left in place — delete it.
