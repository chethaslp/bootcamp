import './globals.css'
import 'bootstrap/dist/css/bootstrap.css'
import { Montserrat } from 'next/font/google'
import { AuthContextProvider } from '@/context/AuthContext'

const f = Montserrat({ subsets: ['latin'] })

export const metadata = {
  title: 'Bootcamp App',
  description: 'Bootstrap your bootcamp.',
}

export default function RootLayout({children,}) {
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
