'use client'

import { type FC } from 'react'

import { Button } from '@/pkg/theme/ui/button'

// interface
interface IProps {
  error: Error & { digest?: string }
  reset: () => void
}

// component
const ErrorModule: FC<Readonly<IProps>> = (props) => {
  const { error, reset } = props

  // render
  return (
    <div className='flex flex-col items-start gap-4 py-12'>
      <h1 className='text-2xl font-semibold tracking-tight'>Something went wrong</h1>
      <p className='text-muted-foreground'>{error.message || 'An unexpected error occurred.'}</p>
      <Button type='button' onClick={reset}>
        Try again
      </Button>
    </div>
  )
}

export { ErrorModule }
