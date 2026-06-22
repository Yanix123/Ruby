import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMovieById } from "@/entities/api/movies";
import { posterUrl } from "@/shared/ui/movie-card";
import { FavoriteToggle } from "@/features/favorite-toggle";

export async function MovieDetailsModule({ id }: { id: string }) {
  const movie = await getMovieById(id);
  if (!movie) notFound();

  return (
    <article className="flex flex-col gap-6 md:flex-row md:items-start">
      <Image
        src={posterUrl(movie.imageUrl, movie.title)}
        alt={movie.title}
        width={320}
        height={480}
        className="w-full max-w-xs rounded-xl object-cover"
      />
      <div className="flex flex-col gap-4">
        <Link href="/movies" className="text-sm text-zinc-500 hover:underline">
          ← Back to movies
        </Link>
        <h1 className="text-3xl font-semibold tracking-tight">{movie.title}</h1>
        {movie.description && (
          <p className="max-w-prose text-zinc-700 dark:text-zinc-300">
            {movie.description}
          </p>
        )}
        <FavoriteToggle movieId={movie.id} />
      </div>
    </article>
  );
}
