import "server-only";

import { cache } from "react";
import { desc, eq } from "drizzle-orm";
import { db } from "@/pkg/db";
import { items } from "@/pkg/db/schema";
import { isUuid } from "../uuid";
import type { Movie } from "@/entities/models";

export async function listMovies(): Promise<Movie[]> {
  return db.select().from(items).orderBy(desc(items.createdAt));
}

// Wrapped in React `cache` so the page module and generateMetadata share one
// query per request instead of hitting the DB twice.
export const getMovieById = cache(
  async (id: string): Promise<Movie | null> => {
    // Guard malformed ids before the uuid column query (else Postgres throws).
    if (!isUuid(id)) return null;
    const [movie] = await db
      .select()
      .from(items)
      .where(eq(items.id, id))
      .limit(1);
    return movie ?? null;
  },
);
