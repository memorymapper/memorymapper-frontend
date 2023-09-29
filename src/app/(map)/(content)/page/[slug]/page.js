import { sanitize, isSupported } from 'isomorphic-dompurify'
import TabContent from './TabContent'


async function getPage(slug) {

    const res = await fetch(process.env.MEMORYMAPPER_ENDPOINT + '1.0/pages/' + slug,  {cache: 'no-cache'})

    if (!res.ok) {
        throw new Error('Failed to fetch page')
    }

    return res.json()
}

export default async function Page({params}) {
    const page = await getPage(params.slug)

    const tabs = [
        {
            name: page.title,
            current: true,
            body: sanitize(page.body)
        }
    ]

    page.sections.forEach((s) => (
        tabs.push(
            {
                name: s.title, 
                current: false,
                body: sanitize(s.body)
            }
        )
    ))
    
    return (
        <TabContent tabs={tabs} />
    )
}