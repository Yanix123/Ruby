import type { Metadata } from 'next'
import { type NextPage } from 'next'

import { getMovieById } from '@/entities/api/movies'
import { MovieDetailsModule } from '@/modules/movie-details'

// Data is fetched from /api/movies/:id at request time — never prerendered at build.
export const dynamic = 'force-dynamic'

// interface
interface IProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata(props: IProps): Promise<Metadata> {
  const { id } = await props.params
  const movie = await getMovieById(id)
  return { title: movie ? movie.title : 'Movie not found' }
}

// component
const MovieDetailsPage: NextPage<Readonly<IProps>> = async (props) => {
  const { id } = await props.params

  // render
  return <MovieDetailsModule id={id} />
}

export default MovieDetailsPage
