import { listMovies } from "@/entities/api/movies";
import { MovieCard } from "@/widgets/movie-card";

// Server Component — reads from Supabase via Drizzle (DoD #1). No "use client".
export async function MoviesModule() {
  const movies = await listMovies();

  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Movies</h1>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {movies.map((movie) => (
          <li key={movie.id}>
            <MovieCard movie={movie} />
          </li>
        ))}
      </ul>
    </section>
  );
}
