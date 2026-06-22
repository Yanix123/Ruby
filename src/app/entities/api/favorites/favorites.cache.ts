import type { Favorite } from "@/entities/models";

export const FAVORITES_KEY = ["favorites"] as const;

// Pure cache transform for the optimistic toggle — no server deps, unit-testable.
export function toggleFavorite(
  list: Favorite[],
  itemId: string,
  isFav: boolean,
): Favorite[] {
  if (isFav) return list.filter((f) => f.itemId !== itemId);
  if (list.some((f) => f.itemId === itemId)) return list;
  return [
    ...list,
    {
      id: `optimistic-${itemId}`,
      userId: "optimistic",
      itemId,
      createdAt: new Date(),
    },
  ];
}
