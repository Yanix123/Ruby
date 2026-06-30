import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { IFavorite } from '@/entities/models'

import { addFavorite, removeFavorite } from './favorites.api'
import { FAVORITES_KEY } from './favorites.query'

// Pure cache transform for the optimistic toggle — no server deps, unit-testable.
export function toggleFavorite(list: IFavorite[], itemId: string, isFav: boolean): IFavorite[] {
  if (isFav) return list.filter((f) => f.itemId !== itemId)
  if (list.some((f) => f.itemId === itemId)) return list
  return [
    ...list,
    {
      id: `optimistic-${itemId}`,
      userId: 'optimistic',
      itemId,
      createdAt: new Date(),
    },
  ]
}

export function useFavoriteToggle(movieId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (isFav: boolean) => (isFav ? removeFavorite(movieId) : addFavorite(movieId)),
    // Optimistic update: flip the cache immediately, roll back on error.
    onMutate: async (isFav: boolean) => {
      await qc.cancelQueries({ queryKey: FAVORITES_KEY })
      const prev = qc.getQueryData<IFavorite[]>(FAVORITES_KEY) ?? []
      qc.setQueryData<IFavorite[]>(FAVORITES_KEY, toggleFavorite(prev, movieId, isFav))
      return { prev }
    },
    onError: (_err, _isFav, ctx) => {
      if (ctx?.prev) qc.setQueryData(FAVORITES_KEY, ctx.prev)
    },
    onSettled: () => qc.invalidateQueries({ queryKey: FAVORITES_KEY }),
  })
}
