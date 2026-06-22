import Link from "next/link";
import type { Movie } from "@/entities/models";
import { MovieCardView } from "@/shared/ui/movie-card";

export function MovieCard({ movie }: { movie: Movie }) {
  return (
    <Link href={`/movies/${movie.id}`} className="block h-full">
      <MovieCardView
        title={movie.title}
        description={movie.description}
        imageUrl={movie.imageUrl}
      />
    </Link>
  );
}
