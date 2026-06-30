import { envClient } from '@/config/env'
import type { IFavorite } from '@/entities/models'

const base = envClient.NEXT_PUBLIC_APP_URL ?? ''

// GET /api/favorites — current user's favorites (browser sends the session cookie).
export const listFavorites = async (): Promise<IFavorite[]> => {
  const res = await fetch(`${base}/api/favorites`, { credentials: 'include', cache: 'no-store' })
  if (!res.ok) return []
  return res.json()
}

// POST /api/favorites
export const addFavorite = async (itemId: string): Promise<void> => {
  await fetch(`${base}/api/favorites`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ itemId }),
  })
}

// DELETE /api/favorites/:itemId
export const removeFavorite = async (itemId: string): Promise<void> => {
  await fetch(`${base}/api/favorites/${itemId}`, { method: 'DELETE', credentials: 'include' })
}
