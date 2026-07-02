import { headers } from 'next/headers'

import { envClient } from '@/config/env'
import type { IMovie } from '@/entities/models'

import 'server-only'

// SSR read for the favorites page — calls the REST endpoint and forwards the
// incoming session cookie so the server resolves the current user.
export async function getFavoriteMovies(): Promise<IMovie[]> {
  // Forward only the session cookie. Passing the whole `headers()` result (a
  // read-only ReadonlyHeaders) into fetch lets the instrumented fetch mutate it,
  // throwing "Headers cannot be modified" during the RSC render on Vercel.
  const cookie = (await headers()).get('cookie') ?? ''
  const res = await fetch(`${envClient.NEXT_PUBLIC_APP_URL}/api/favorites/movies`, {
    headers: { cookie },
    cache: 'no-store',
  })
  if (!res.ok) return []
  return res.json()
}
