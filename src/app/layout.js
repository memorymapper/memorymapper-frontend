import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Memory Mapper',
  description: 'A toolkit for mapping history and place',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className + ' h-screen'}>
        {children}
      </body>
    </html>
  )
}
