import { sanitize, isSupported } from 'isomorphic-dompurify'

async function getPage() {
    const res = await fetch(process.env.MEMORYMAPPER_ENDPOINT + '2.0/pages/front/', {cache: 'no-cache'})

    if (!res.ok) {
        throw new Error('Failed to fetch page')
    }

    return res.json()
}


export default async function Page() {

    const page = await getPage()

    const clean = sanitize(page.body)

    return (
        <div className="w-full h-full overflow-auto">
            <h1>{ page.title }</h1>
            <div dangerouslySetInnerHTML={{__html: clean}}></div>
        </div>
    )
}