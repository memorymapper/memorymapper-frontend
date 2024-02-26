import ContentPanelSelect from "@/components/buttons/ContentPanelSelect"
import Link from "next/link"
import { notFound } from "next/navigation"

async function getFeature(uuid) {

    const res = await fetch(process.env.MEMORYMAPPER_ENDPOINT + '2.0/features/' + uuid + '/attachments', {cache: 'no-store'})

    if (!res.ok) {
        throw new Error('Failed to fetch feature')
    }

    return res.json()
}

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default async function AttachmentLayout({params, children}) {

    const feature = await getFeature(params.uuid)

    if (!feature) {
        notFound()
    }

    const tabs = feature.attachments.map((a, index) => (
        {
            name: a.title, 
            href: '/feature/' + params.uuid + '/' + a.slug, 
            current: a.slug == params.slug ? true : false,
            color: feature.properties.color,
        }
    ))

    return ( 
        <div className="h-full overflow-hidden">
            <ContentPanelSelect tabs={tabs} />
            <div className="hidden sm:block">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        {tabs.map((tab) => (
                        <Link
                            key={tab.name}
                            href={tab.href}
                            className={classNames(
                            tab.current
                                ? 'border-gray-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                            'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-light'
                            )}
                            aria-current={tab.current ? 'page' : undefined}
                            style={{color: tab.color}}
                        >
                            {tab.name}
                        </Link>
                        ))}
                    </nav>
                </div>
            </div>
            <div className="h-5/6 overflow-auto py-7">
                {children}
            </div>
        </div>
    )
}