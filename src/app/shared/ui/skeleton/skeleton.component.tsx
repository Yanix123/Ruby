import { type FC } from 'react'

import { cn } from '@/pkg/theme/lib/utils'

// interface
interface IProps {
  className?: string
}

// component
const Skeleton: FC<Readonly<IProps>> = (props) => {
  const { className } = props

  // render
  return <div aria-hidden='true' className={cn('bg-accent animate-pulse rounded-md', className)} />
}

export { Skeleton }
