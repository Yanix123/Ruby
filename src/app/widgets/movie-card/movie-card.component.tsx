import Link from 'next/link'
import { type FC } from 'react'

import type { IMovie } from '@/entities/models'
import { MovieCardView } from '@/shared/ui/movie-card'

// interface
interface IProps {
  movie: IMovie
}

// component
const MovieCard: FC<Readonly<IProps>> = (props) => {
  const { movie } = props

  // render
  return (
    <Link href={`/movies/${movie.id}`} className='block h-full'>
      <MovieCardView title={movie.title} description={movie.description} imageUrl={movie.imageUrl} />
    </Link>
  )
}

export { MovieCard }
