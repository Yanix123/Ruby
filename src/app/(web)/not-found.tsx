import Link from "next/link";

export default function WebNotFound() {
  return (
    <div className="flex flex-col items-start gap-4 py-12">
      <h1 className="text-2xl font-semibold tracking-tight">Not found</h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        We couldn&apos;t find what you were looking for.
      </p>
      <Link
        href="/movies"
        className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
      >
        Back to movies
      </Link>
    </div>
  );
}
