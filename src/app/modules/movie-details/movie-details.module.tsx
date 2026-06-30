import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { type FC } from 'react'

import { getMovieById } from '@/entities/api/movies'
import { FavoriteToggle } from '@/features/favorite-toggle'
import { posterUrl } from '@/shared/ui/movie-card'

// interface
interface IProps {
  id: string
}

// component — Server Component: SSR detail via the /api/movies/:id endpoint.
const MovieDetailsModule: FC<Readonly<IProps>> = async (props) => {
  const { id } = props

  const movie = await getMovieById(id)
  if (!movie) notFound()

  // render
  return (
    <article className='flex flex-col gap-6 md:flex-row md:items-start'>
      <Image
        src={posterUrl(movie.imageUrl, movie.title)}
        alt={movie.title}
        width={320}
        height={480}
        className='w-full max-w-xs rounded-xl object-cover'
      />
      <div className='flex flex-col gap-4'>
        <Link href='/movies' className='text-muted-foreground text-sm hover:underline'>
          ← Back to movies
        </Link>
        <h1 className='text-3xl font-semibold tracking-tight'>{movie.title}</h1>
        {movie.description && <p className='text-muted-foreground max-w-prose'>{movie.description}</p>}
        <FavoriteToggle movieId={movie.id} />
      </div>
    </article>
  )
}

export { MovieDetailsModule }
