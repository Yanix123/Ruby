import { useQuery } from "@tanstack/react-query";
import { listFavorites } from "./favorites.api";
import { FAVORITES_KEY } from "./favorites.cache";

export function useFavorites(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: FAVORITES_KEY,
    queryFn: () => listFavorites(),
    enabled: options?.enabled ?? true,
  });
}
