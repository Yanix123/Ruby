"use server";

import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "@/pkg/db";
import { favorites } from "@/pkg/db/schema";
import { auth } from "@/pkg/auth/auth";
import { isUuid } from "../uuid";
import type { Favorite } from "@/entities/models";

// userId is ALWAYS derived from the server session — never trusted from the client (DoD #5).
async function requireUser(): Promise<string> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");
  return session.user.id;
}

// Defense-in-depth: reject malformed ids before they reach the uuid column.
function assertItemId(itemId: string): void {
  if (!isUuid(itemId)) throw new Error("Invalid item id");
}

export async function listFavorites(): Promise<Favorite[]> {
  // Public read: a logged-out visitor simply has no favorites (the movie
  // details page is public). Writes below still require a session.
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return [];
  return db
    .select()
    .from(favorites)
    .where(eq(favorites.userId, session.user.id));
}

export async function addFavorite(itemId: string): Promise<void> {
  assertItemId(itemId);
  const userId = await requireUser();
  await db.insert(favorites).values({ userId, itemId }).onConflictDoNothing();
}

export async function removeFavorite(itemId: string): Promise<void> {
  assertItemId(itemId);
  const userId = await requireUser();
  await db
    .delete(favorites)
    .where(and(eq(favorites.userId, userId), eq(favorites.itemId, itemId)));
}
