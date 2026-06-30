import type { Metadata } from 'next'

import { geistMono, geistSans } from '@/config/fonts'
import { QueryProvider } from '@/pkg/query'
import { ThemeProvider } from '@/pkg/theme'
import { Toaster } from '@/pkg/theme/ui/sonner'
import { SiteHeader } from '@/widgets/site-header'

import '@/config/styles/global.css'

export const metadata: Metadata = {
  title: 'Movie Catalog',
  description: 'A mini full-stack movie catalog',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang='en'
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className='flex min-h-full flex-col'>
        <ThemeProvider>
          <QueryProvider>
            <div className='flex min-h-full flex-col'>
              <SiteHeader />
              <main className='mx-auto w-full max-w-5xl flex-1 px-6 py-8'>{children}</main>
            </div>
          </QueryProvider>

          <Toaster position='top-center' duration={3000} />
        </ThemeProvider>
      </body>
    </html>
  )
}
