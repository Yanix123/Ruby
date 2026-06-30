import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

import { db } from '@/pkg/db'
import { favorites } from '@/pkg/db/schema.table'
import { isUuid } from '@/pkg/lib'
import { auth } from '@/shared/auth/auth.server'

// GET /api/favorites — current user's favorites (empty when logged out).
export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json([])

  const rows = await db.select().from(favorites).where(eq(favorites.userId, session.user.id))
  return NextResponse.json(rows)
}

// POST /api/favorites — add a favorite. userId comes from the session, never the body.
export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = (await req.json().catch(() => null)) as { itemId?: string } | null
  const itemId = body?.itemId
  if (!itemId || !isUuid(itemId)) return NextResponse.json({ error: 'Invalid item id' }, { status: 400 })

  await db.insert(favorites).values({ userId: session.user.id, itemId }).onConflictDoNothing()
  return NextResponse.json({ ok: true })
}
