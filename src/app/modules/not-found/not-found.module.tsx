import Link from 'next/link'
import { type FC } from 'react'

import { Button } from '@/pkg/theme/ui/button'

// interface
interface IProps {}

// component
const NotFoundModule: FC<Readonly<IProps>> = () => {
  // render
  return (
    <div className='flex flex-col items-start gap-4 py-12'>
      <h1 className='text-2xl font-semibold tracking-tight'>Not found</h1>
      <p className='text-muted-foreground'>We couldn&apos;t find what you were looking for.</p>
      <Button asChild>
        <Link href='/movies'>Back to movies</Link>
      </Button>
    </div>
  )
}

export { NotFoundModule }
