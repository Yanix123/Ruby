export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-black/[.08] dark:bg-white/[.1] ${className}`}
      aria-hidden="true"
    />
  );
}
