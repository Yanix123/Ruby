'use client'

import { type FC, type ReactNode, useState } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// interface
interface IProps {
  children: ReactNode
}

// component
const QueryProvider: FC<Readonly<IProps>> = (props) => {
  const { children } = props

  // Create the client once per mount — never inline (would reset cache every render).
  const [queryClient] = useState(() => new QueryClient())

  // return
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

export { QueryProvider }
