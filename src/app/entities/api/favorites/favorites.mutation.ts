import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Favorite } from "@/entities/models";
import { addFavorite, removeFavorite } from "./favorites.api";
import { FAVORITES_KEY, toggleFavorite } from "./favorites.cache";

export function useFavoriteToggle(movieId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (isFav: boolean) =>
      isFav ? removeFavorite(movieId) : addFavorite(movieId),
    // Optimistic update: flip the cache immediately, roll back on error.
    onMutate: async (isFav: boolean) => {
      await qc.cancelQueries({ queryKey: FAVORITES_KEY });
      const prev = qc.getQueryData<Favorite[]>(FAVORITES_KEY) ?? [];
      qc.setQueryData<Favorite[]>(
        FAVORITES_KEY,
        toggleFavorite(prev, movieId, isFav),
      );
      return { prev };
    },
    onError: (_err, _isFav, ctx) => {
      if (ctx?.prev) qc.setQueryData(FAVORITES_KEY, ctx.prev);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: FAVORITES_KEY }),
  });
}
