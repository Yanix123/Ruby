import { envClient } from '@/config/env'
import type { IMovie } from '@/entities/models'

// Absolute base so the fetchers work both in the browser and in Server Components.
const base = envClient.NEXT_PUBLIC_APP_URL ?? ''

// GET /api/movies
export const listMovies = async (): Promise<IMovie[]> => {
  const res = await fetch(`${base}/api/movies`, { cache: 'no-store' })
  if (!res.ok) return []
  return res.json()
}

// GET /api/movies/:id
export const getMovieById = async (id: string): Promise<IMovie | null> => {
  const res = await fetch(`${base}/api/movies/${id}`, { cache: 'no-store' })
  if (!res.ok) return null
  return res.json()
}
