import { createAuthClient } from 'better-auth/react'

import { envClient } from '@/config/env'

// better-auth client points at the Next.js /api/auth route handler (same origin).
export const authClient = createAuthClient({
  baseURL: envClient.NEXT_PUBLIC_BETTER_AUTH_URL ?? envClient.NEXT_PUBLIC_APP_URL,
})

export const { signIn, signUp, signOut, useSession } = authClient
