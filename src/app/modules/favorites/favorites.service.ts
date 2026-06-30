import { headers } from 'next/headers'

import { envClient } from '@/config/env'
import type { IMovie } from '@/entities/models'

import 'server-only'

// SSR read for the favorites page — calls the REST endpoint and forwards the
// incoming session cookie so the server resolves the current user.
export async function getFavoriteMovies(): Promise<IMovie[]> {
  const res = await fetch(`${envClient.NEXT_PUBLIC_APP_URL}/api/favorites/movies`, {
    headers: await headers(),
    cache: 'no-store',
  })
  if (!res.ok) return []
  return res.json()
}
