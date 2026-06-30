'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { type FC } from 'react'

import { Button } from '@/pkg/theme/ui/button'
import { signOut, useSession } from '@/shared/auth'

// interface
interface IProps {}

// component
const SiteHeader: FC<Readonly<IProps>> = () => {
  const router = useRouter()
  const { data: session, isPending } = useSession()

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
    router.refresh()
  }

  // render
  return (
    <header className='border-b border-black/[.08] dark:border-white/[.145]'>
      <nav className='mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4'>
        <Link href='/movies' className='text-lg font-semibold tracking-tight'>
          🎬 Movie Catalog
        </Link>
        <div className='flex items-center gap-4 text-sm font-medium'>
          <Link href='/movies' className='hover:underline'>
            Movies
          </Link>
          {!isPending && session ? (
            <>
              <Link href='/favorites' className='hover:underline'>
                Favorites
              </Link>
              <span className='text-muted-foreground'>{session.user.email}</span>
              <Button type='button' variant='outline' size='sm' onClick={handleSignOut}>
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Link href='/login' className='hover:underline'>
                Login
              </Link>
              <Link
                href='/register'
                className='bg-foreground text-background rounded-full px-3 py-1 transition-colors hover:opacity-90'
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}

export { SiteHeader }
