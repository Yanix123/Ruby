import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { headers } from 'next/headers'

import { db } from '@/pkg/db'
import * as schema from '@/pkg/db/schema.table'

import 'server-only'

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: 'pg', schema }),
  emailAndPassword: { enabled: true },
})

// Authoritative server-side session read (Server Components / Server Actions / proxy fallback).
export const getSession = async () => auth.api.getSession({ headers: await headers() })
