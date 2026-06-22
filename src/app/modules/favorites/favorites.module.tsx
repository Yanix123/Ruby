import { eq } from "drizzle-orm";
import { db } from "@/pkg/db";
import { favorites, items } from "@/pkg/db/schema";
import { FavoritesList } from "@/widgets/favorites-list";

export async function FavoritesModule({ userId }: { userId: string }) {
  // Scoped to the current user (DoD #5) — read fresh from the DB (DoD #4).
  const rows = await db
    .select({ item: items })
    .from(favorites)
    .innerJoin(items, eq(favorites.itemId, items.id))
    .where(eq(favorites.userId, userId));

  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Your favorites</h1>
      <FavoritesList movies={rows.map((r) => r.item)} />
    </section>
  );
}
