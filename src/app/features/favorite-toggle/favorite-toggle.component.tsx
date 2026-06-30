'use client'

import Link from 'next/link'
import { type FC } from 'react'

import { useFavorites, useFavoriteToggle } from '@/entities/api/favorites'
import { Button } from '@/pkg/theme/ui/button'
import { useSession } from '@/shared/auth'

// interface
interface IProps {
  movieId: string
}

// component
const FavoriteToggle: FC<Readonly<IProps>> = (props) => {
  const { movieId } = props

  const { data: session, isPending: sessionPending } = useSession()
  const isAuthed = !!session

  const { data: favs = [], isPending: favsLoading } = useFavorites({
    enabled: isAuthed,
  })
  const isFav = favs.some((f) => f.itemId === movieId)
  const { mutate, isPending } = useFavoriteToggle(movieId)

  if (!sessionPending && !isAuthed) {
    return (
      <Button asChild variant='outline'>
        <Link href='/login'>☆ Sign in to save</Link>
      </Button>
    )
  }

  // render
  return (
    <Button
      type='button'
      variant={isFav ? 'default' : 'outline'}
      aria-pressed={isFav}
      onClick={() => mutate(isFav)}
      disabled={isPending || favsLoading || sessionPending}
    >
      {isFav ? '★ In favorites' : '☆ Add to favorites'}
    </Button>
  )
}

export { FavoriteToggle }
