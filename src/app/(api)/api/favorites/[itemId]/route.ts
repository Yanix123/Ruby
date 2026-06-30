import { and, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

import { db } from '@/pkg/db'
import { favorites } from '@/pkg/db/schema.table'
import { auth } from '@/shared/auth/auth.server'

// DELETE /api/favorites/:itemId — remove a favorite (scoped to the session user).
export async function DELETE(_req: Request, ctx: { params: Promise<{ itemId: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { itemId } = await ctx.params
  await db.delete(favorites).where(and(eq(favorites.userId, session.user.id), eq(favorites.itemId, itemId)))

  return NextResponse.json({ ok: true })
}
