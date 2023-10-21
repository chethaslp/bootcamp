import './globals.css'
import 'bootstrap/dist/css/bootstrap.css'
import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import { AuthContextProvider } from '@/context/AuthContext'

const f = Montserrat({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Bootcamp App',
  description: 'Bootstrap your bootcamp.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${f.className} bg h-screen w-screen overflow-y-visible`}>  
      <AuthContextProvider>
          {children}
      </AuthContextProvider>
      </body>
    </html>
  )
}
