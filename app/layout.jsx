import './globals.css'
// import 'bootstrap/dist/css/bootstrap.css'
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
      <head>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"/>
      </head>
      <body className={`${f.className} bg h-screen w-screen overflow-y-visible`}>  
      <AuthContextProvider>
          {children}
      </AuthContextProvider>
      </body>
    </html>
  )
}
