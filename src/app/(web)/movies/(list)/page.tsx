import { type NextPage } from 'next'

import { MoviesModule } from '@/modules/movies'

// Reads from /api/movies at request time (SSR) — not prerendered at build.
export const dynamic = 'force-dynamic'

// interface
interface IProps {}

// component
const MoviesPage: NextPage<Readonly<IProps>> = () => {
  // render
  return <MoviesModule />
}

export default MoviesPage
