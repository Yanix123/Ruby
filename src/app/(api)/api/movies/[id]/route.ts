import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

import { db } from '@/pkg/db'
import { items } from '@/pkg/db/schema.table'
import { isUuid } from '@/pkg/lib'

// GET /api/movies/:id — public detail (Drizzle).
export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params

  if (!isUuid(id)) return NextResponse.json({ error: 'Not Found' }, { status: 404 })

  const [movie] = await db.select().from(items).where(eq(items.id, id)).limit(1)
  if (!movie) return NextResponse.json({ error: 'Not Found' }, { status: 404 })

  return NextResponse.json(movie)
}
