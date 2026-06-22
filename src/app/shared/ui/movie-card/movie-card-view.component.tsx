import Image from "next/image";
import { posterUrl } from "./poster";

// Presentational-only card — takes primitives, not a domain model, so `shared`
// stays decoupled from `entities`.
export function MovieCardView({
  title,
  description,
  imageUrl,
}: {
  title: string;
  description: string | null;
  imageUrl: string | null;
}) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-black/[.08] bg-white transition-shadow hover:shadow-md dark:border-white/[.145] dark:bg-zinc-900">
      <Image
        src={posterUrl(imageUrl, title)}
        alt={title}
        width={400}
        height={600}
        className="aspect-[2/3] w-full object-cover"
      />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-semibold leading-tight">{title}</h3>
        {description && (
          <p className="line-clamp-3 text-sm text-zinc-600 dark:text-zinc-400">
            {description}
          </p>
        )}
      </div>
    </article>
  );
}
