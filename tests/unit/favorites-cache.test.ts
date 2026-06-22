import { describe, it, expect } from "vitest";
import { toggleFavorite } from "@/entities/api/favorites/favorites.cache";
import type { Favorite } from "@/entities/models";

const fav = (itemId: string): Favorite => ({
  id: itemId,
  userId: "u1",
  itemId,
  createdAt: new Date(),
});

describe("toggleFavorite", () => {
  it("adds a favorite when not present", () => {
    const out = toggleFavorite([], "m1", false);
    expect(out.map((f) => f.itemId)).toContain("m1");
  });

  it("removes a favorite when present", () => {
    const out = toggleFavorite([fav("m1")], "m1", true);
    expect(out).toHaveLength(0);
  });

  it("is idempotent on a duplicate add", () => {
    const out = toggleFavorite([fav("m1")], "m1", false);
    expect(out).toHaveLength(1);
  });

  it("does not touch other items when removing", () => {
    const out = toggleFavorite([fav("m1"), fav("m2")], "m1", true);
    expect(out.map((f) => f.itemId)).toEqual(["m2"]);
  });
});
