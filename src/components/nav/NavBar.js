import Link from "next/link"
import Search from "../search/Search"

async function getSiteConfig() {
    const res = await fetch(process.env.MEMORYMAPPER_ENDPOINT + '2.0/config/')

    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch site config')
    }

    return res.json()
}

async function getPages() {
    const res = await fetch(process.env.MEMORYMAPPER_ENDPOINT + '1.0/pages/')

    if (!res.ok) {
        throw new Error('Failed to fetch page list')
    }

    return res.json()
}


export default async function NavBar(props) {

    const siteConfig = await getSiteConfig()

    const pages = await getPages()

    return (
        <nav className="w-full h-12 bg-white flex flex-row shadow-sm justify-between px-6 items-center  font-light">
            <div>
                <Link href="/"><h1 className="italic text-lg">{siteConfig.SITE_TITLE + ': ' + siteConfig.SITE_SUBTITLE}</h1></Link>
            </div>
            <div className="flex flex-row">
                {pages ? pages.map((item) => (
                    <Link key={props.slug} className="h-full mx-4 pt-1.5 text-sm text-slate-500 hover:text-slate-700 hover:border-b border-slate-700" href={'/page/' + item.slug}>{item.title}</Link>
                )) : null}
                <Search />
            </div>
        </nav>
    )
}