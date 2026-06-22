import type { Metadata } from "next";
import { getMovieById } from "@/entities/api/movies";
import { MovieDetailsModule } from "@/modules/movie-details";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const movie = await getMovieById(id);
  return { title: movie ? movie.title : "Movie not found" };
}

export default async function MovieDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // params is async in Next.js 16.
  const { id } = await params;
  return <MovieDetailsModule id={id} />;
}
