import Link from 'next/link'
import { type FC } from 'react'

import type { IMovie } from '@/entities/models'
import { MovieCardView } from '@/shared/ui/movie-card'

// interface
interface IProps {
  movies: IMovie[]
}

// component
const FavoritesList: FC<Readonly<IProps>> = (props) => {
  const { movies } = props

  if (movies.length === 0) {
    return (
      <p className='text-zinc-600 dark:text-zinc-400'>
        No favorites yet. Browse the{' '}
        <Link href='/movies' className='underline'>
          catalog
        </Link>{' '}
        and add some.
      </p>
    )
  }

  // render
  return (
    <ul className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4'>
      {movies.map((movie) => (
        <li key={movie.id}>
          <Link href={`/movies/${movie.id}`} className='block h-full'>
            <MovieCardView title={movie.title} description={movie.description} imageUrl={movie.imageUrl} />
          </Link>
        </li>
      ))}
    </ul>
  )
}

export { FavoritesList }
