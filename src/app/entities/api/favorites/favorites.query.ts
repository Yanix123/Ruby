import { queryOptions, useQuery } from '@tanstack/react-query'

import { listFavorites } from './favorites.api'

// The favorites query key (shared by the query factory and the optimistic mutation).
export const FAVORITES_KEY = ['favorites'] as const

export const favoritesQueryOptions = (options?: { enabled?: boolean }) =>
  queryOptions({
    queryKey: FAVORITES_KEY,
    queryFn: () => listFavorites(),
    enabled: options?.enabled ?? true,
  })

export function useFavorites(options?: { enabled?: boolean }) {
  return useQuery(favoritesQueryOptions(options))
}
