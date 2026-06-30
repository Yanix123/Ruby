import { desc } from 'drizzle-orm'
import { NextResponse } from 'next/server'

import { db } from '@/pkg/db'
import { items } from '@/pkg/db/schema.table'

// GET /api/movies — public list (Drizzle).
export async function GET() {
  const movies = await db.select().from(items).orderBy(desc(items.createdAt))
  return NextResponse.json(movies)
}
