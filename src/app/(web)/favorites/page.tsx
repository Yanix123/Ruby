import { type NextPage } from 'next'
import { redirect } from 'next/navigation'

import { FavoritesModule } from '@/modules/favorites'
import { getSession } from '@/shared/auth/auth.server'

// interface
interface IProps {}

// component
const FavoritesPage: NextPage<Readonly<IProps>> = async () => {
  const session = await getSession()
  if (!session) redirect('/login')

  // render
  return <FavoritesModule />
}

export default FavoritesPage
