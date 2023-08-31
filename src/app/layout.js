import './globals.css'
import Providers from './providers'
import NavBar from '@/components/nav/NavBar'

export const metadata = {
  title: 'Memory Mapper',
  description: 'A toolkit for mapping history and place',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="h-screen">
        <Providers>
          <NavBar />
          {children}
        </Providers>
      </body>
    </html>
  )
}
