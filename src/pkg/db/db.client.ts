import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import { envServer } from '@/config/env'

import * as schema from './schema.table'

// prepare:false is REQUIRED for the Supabase Transaction Pooler (prepared statements unsupported).
const client = postgres(envServer.DATABASE_URL, { prepare: false })

export const db = drizzle({ client, schema })
