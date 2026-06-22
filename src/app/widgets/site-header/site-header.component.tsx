"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "@/pkg/auth/auth-client";

export function SiteHeader() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
    router.refresh(); // refresh Server Components so the cleared session is reflected
  };

  return (
    <header className="border-b border-black/[.08] dark:border-white/[.145]">
      <nav className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/movies" className="text-lg font-semibold tracking-tight">
          🎬 Movie Catalog
        </Link>
        <div className="flex items-center gap-4 text-sm font-medium">
          <Link href="/movies" className="hover:underline">
            Movies
          </Link>
          {!isPending && session ? (
            <>
              <Link href="/favorites" className="hover:underline">
                Favorites
              </Link>
              <span className="text-zinc-500">{session.user.email}</span>
              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-full border border-black/[.08] px-3 py-1 transition-colors hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:underline">
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-foreground px-3 py-1 text-background transition-colors hover:opacity-90"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
