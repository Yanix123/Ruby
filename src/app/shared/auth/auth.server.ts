import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { nextCookies } from 'better-auth/next-js'
import { headers } from 'next/headers'

import { db } from '@/pkg/db'
import * as schema from '@/pkg/db/schema.table'

import 'server-only'

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: 'pg', schema }),
  emailAndPassword: { enabled: true },
  // Next.js integration: forwards Set-Cookie to next/headers and skips session
  // refresh during RSC render (where cookies can't be written). Must be last.
  plugins: [nextCookies()],
})

// Authoritative server-side session read (Server Components / Server Actions / proxy fallback).
export const getSession = async () => auth.api.getSession({ headers: await headers() })
