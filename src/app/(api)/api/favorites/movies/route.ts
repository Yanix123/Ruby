import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

import { db } from '@/pkg/db'
import { favorites, items } from '@/pkg/db/schema.table'
import { auth } from '@/shared/auth/auth.server'

// GET /api/favorites/movies — current user's favorite movies (joined).
export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const rows = await db
    .select({ item: items })
    .from(favorites)
    .innerJoin(items, eq(favorites.itemId, items.id))
    .where(eq(favorites.userId, session.user.id))

  return NextResponse.json(rows.map((r) => r.item))
}
