import Image from 'next/image'
import { type FC } from 'react'

import { Card } from '@/pkg/theme/ui/card'

import { posterUrl } from './poster.util'

// interface
interface IProps {
  title: string
  description: string | null
  imageUrl: string | null
}

// component
const MovieCardView: FC<Readonly<IProps>> = (props) => {
  const { title, description, imageUrl } = props

  // render
  return (
    <Card className='h-full gap-0 overflow-hidden py-0 transition-shadow hover:shadow-md'>
      <Image
        src={posterUrl(imageUrl, title)}
        alt={title}
        width={400}
        height={600}
        className='aspect-[2/3] w-full object-cover'
      />
      <div className='flex flex-1 flex-col gap-2 p-4'>
        <h3 className='leading-tight font-semibold'>{title}</h3>
        {description && <p className='text-muted-foreground line-clamp-3 text-sm'>{description}</p>}
      </div>
    </Card>
  )
}

export { MovieCardView }
