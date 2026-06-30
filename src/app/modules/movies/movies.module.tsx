import { type FC } from 'react'

import { listMovies } from '@/entities/api/movies'
import { MovieCard } from '@/widgets/movie-card'

// interface
interface IProps {}

// component — Server Component: SSR initial render via the /api/movies endpoint.
const MoviesModule: FC<Readonly<IProps>> = async () => {
  const movies = await listMovies()

  // render
  return (
    <section className='flex flex-col gap-6'>
      <h1 className='text-2xl font-semibold tracking-tight'>Movies</h1>
      <ul className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4'>
        {movies.map((movie) => (
          <li key={movie.id}>
            <MovieCard movie={movie} />
          </li>
        ))}
      </ul>
    </section>
  )
}

export { MoviesModule }
