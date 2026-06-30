import { toNextJsHandler } from 'better-auth/next-js'

import { auth } from '@/shared/auth/auth.server'

// Better Auth handles requests at runtime — never statically prerender this catch-all route.
export const dynamic = 'force-dynamic'

export const { POST, GET } = toNextJsHandler(auth)
