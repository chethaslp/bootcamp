import './globals.css'
import 'bootstrap/dist/css/bootstrap.css'
import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import { Nav } from './util'
import { AuthContextProvider } from '@/context/AuthContext'
import Loading from './loading'
import { Suspense } from 'react'

const f = Montserrat({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Bootcamp.',
  description: 'Bootstrap your bootcamp.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${f.className} bg`}>  
      <AuthContextProvider>
          {children}
      </AuthContextProvider>
      </body>
    </html>
  )
}
