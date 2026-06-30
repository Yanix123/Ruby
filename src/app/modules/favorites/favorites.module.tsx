import { type FC } from 'react'

import { FavoritesList } from '@/widgets/favorites-list'

import { getFavoriteMovies } from './favorites.service'

// interface
interface IProps {}

// component — Server Component: SSR favorites via the /api/favorites/movies endpoint.
const FavoritesModule: FC<Readonly<IProps>> = async () => {
  const movies = await getFavoriteMovies()

  // render
  return (
    <section className='flex flex-col gap-6'>
      <h1 className='text-2xl font-semibold tracking-tight'>Your favorites</h1>
      <FavoritesList movies={movies} />
    </section>
  )
}

export { FavoritesModule }
