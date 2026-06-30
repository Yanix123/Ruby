// Single source of truth for the poster fallback (used by the card view and details).
export function posterUrl(imageUrl: string | null, title: string): string {
  return imageUrl ?? `https://placehold.co/400x600/1e293b/e2e8f0/png?text=${encodeURIComponent(title)}`
}
