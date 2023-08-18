import Link from "next/link"

async function getFeature(uuid) {

    const res = await fetch(process.env.MEMORYMAPPER_ENDPOINT + 'features/' + uuid + '/attachments', {cache: 'no-store'})

    if (!res.ok) {
        throw new Error('Failed to fetch feature')
    }

    return res.json()
}

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}


export default async function PanelLayout({params, children}) {
    const feature = await getFeature(params.uuid)

    const tabs = feature.attachments.map((a, index) => (
        {
            name: a.title, 
            href: '/feature/' + params.uuid + '/' + a.slug, current: index == 0 ? true : false 
        }
    ))

    return (
        <div className="h-full overflow-hidden">
            <h2>{ feature.properties.name }</h2>
            {children}
        </div>
    )
}