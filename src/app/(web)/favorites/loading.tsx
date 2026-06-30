import { Skeleton } from '@/shared/ui/skeleton'

export default function FavoritesLoading() {
  return (
    <section className='flex flex-col gap-6'>
      <Skeleton className='h-8 w-48' />
      <ul className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4'>
        {Array.from({ length: 4 }).map((_, i) => (
          <li key={i} className='flex flex-col gap-3'>
            <Skeleton className='aspect-[2/3] w-full' />
            <Skeleton className='h-4 w-3/4' />
          </li>
        ))}
      </ul>
    </section>
  )
}
