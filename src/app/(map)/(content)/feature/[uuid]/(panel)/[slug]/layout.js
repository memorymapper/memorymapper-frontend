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

export default async function AttachmentLayout({params, children}) {

    const feature = await getFeature(params.uuid)

    const tabs = feature.attachments.map((a, index) => (
        {
            name: a.title, 
            href: '/feature/' + params.uuid + '/' + a.slug, current: a.slug == params.slug ? true : false 
        }
    ))

    return (
        <div className="h-full overflow-hidden">
                <div className="sm:hidden">
                    <label htmlFor="tabs" className="sr-only">
                    Select a tab
                    </label>
                    {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
                    <select
                    id="tabs"
                    name="tabs"
                    className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    defaultValue={tabs.find((tab) => tab.current).name}
                    >
                    {tabs.map((tab) => (
                        <option key={tab.name}>{tab.name}</option>
                    ))}
                    </select>
                </div>
                <div className="hidden sm:block">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                            {tabs.map((tab) => (
                            <Link
                                key={tab.name}
                                href={tab.href}
                                className={classNames(
                                tab.current
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                                'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-light'
                                )}
                                aria-current={tab.current ? 'page' : undefined}
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