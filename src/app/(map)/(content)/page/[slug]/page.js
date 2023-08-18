import { sanitize, isSupported } from 'isomorphic-dompurify'

async function getPage(slug) {

    const res = await fetch(process.env.MEMORYMAPPER_ENDPOINT + '1.0/pages/' + slug)

    if (!res.ok) {
        throw new Error('Failed to fetch page')
    }

    return res.json()
}

export default async function Page({params}) {
    const page = await getPage(params.slug)

    const clean = sanitize(page.body)
    
    return (
        <div>
            <h1>{page.title}</h1>
            <div dangerouslySetInnerHTML={{__html: clean}}></div>
        </div>
    )
}