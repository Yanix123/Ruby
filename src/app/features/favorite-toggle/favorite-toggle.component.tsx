"use client";

import Link from "next/link";
import { useFavorites, useFavoriteToggle } from "@/entities/api/favorites";
import { useSession } from "@/pkg/auth/auth-client";

export function FavoriteToggle({ movieId }: { movieId: string }) {
  const { data: session, isPending: sessionPending } = useSession();
  const isAuthed = !!session;

  // Only query favorites when signed in (the action returns [] otherwise).
  const { data: favs = [], isPending: favsLoading } = useFavorites({
    enabled: isAuthed,
  });
  const isFav = favs.some((f) => f.itemId === movieId);
  const { mutate, isPending } = useFavoriteToggle(movieId);

  // Guests can't save — send them to sign in.
  if (!sessionPending && !isAuthed) {
    return (
      <Link
        href="/login"
        className="inline-flex items-center gap-2 rounded-full border border-black/[.12] px-4 py-2 text-sm font-medium transition-colors hover:bg-black/[.04] dark:border-white/[.2] dark:hover:bg-white/[.06]"
      >
        ☆ Sign in to save
      </Link>
    );
  }

  return (
    <button
      type="button"
      aria-pressed={isFav}
      onClick={() => mutate(isFav)}
      disabled={isPending || favsLoading || sessionPending}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${
        isFav
          ? "bg-amber-400 text-black hover:bg-amber-300"
          : "border border-black/[.12] hover:bg-black/[.04] dark:border-white/[.2] dark:hover:bg-white/[.06]"
      }`}
    >
      {isFav ? "★ In favorites" : "☆ Add to favorites"}
    </button>
  );
}
