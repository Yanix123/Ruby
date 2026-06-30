// Client-safe surface only. The server better-auth instance + getSession live in
// `./auth.server` (server-only) and are imported via `@/shared/auth/auth.server`.
export { authClient, signIn, signOut, signUp, useSession } from './auth.client'
