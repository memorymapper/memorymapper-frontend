import './globals.css'
import Providers from './providers'
import NavBar from '@/components/nav/NavBar'
import WelcomeModal from '@/components/content/WelcomeModal'

export const metadata = {
  title: 'Memory Mapper',
  description: 'A toolkit for mapping history and place',
}

async function getSiteConfig() {
  const res = await fetch(process.env.MEMORYMAPPER_ENDPOINT + '2.0/config/', {cache: 'no-cache'})

  if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch site config')
  }

  return res.json()
}

async function getPages() {
  const res = await fetch(process.env.MEMORYMAPPER_ENDPOINT + '1.0/pages/', {cache: 'no-cache'})

  if (!res.ok) {
      throw new Error('Failed to fetch page list')
  }

  return res.json()
}


export default async function RootLayout({ children }) {

  const siteConfig = await getSiteConfig()

  const pages = await getPages()

  return (
    <html lang="en">
      <body className="h-screen">
        <Providers>
          <NavBar pages={pages} siteConfig={siteConfig}/>
          <WelcomeModal />
          {children}
        </Providers>
      </body>
    </html>
  )
}
