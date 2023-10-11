'use client'
import ContentPanelSelect from "@/components/buttons/ContentPanelSelect"
import { useState } from "react"


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function TabContent(props) {

    const [activeTabs, setActiveTabs] = useState(props.tabs)

    function handleClick(e) {
        const updatedTabs = activeTabs.map(el => el.name == e.target.id ? {...el, current: true} : {...el, current: false})
        setActiveTabs(updatedTabs)
    }

    return (
        <>
            {activeTabs ? activeTabs.map((tab) => (
                    <div className={tab.current ? 'block' : 'hidden'} key={tab.name}>
                        <h1>{tab.name}</h1>
                    </div>
                ) 
            ) : null}
            {activeTabs.length > 1 ? (
                <>
                    <ContentPanelSelect tabs={props.tabs} activeTabs={activeTabs} setActiveTabs={setActiveTabs} />
                    <div className="hidden sm:block">
                        <div className="border-b border-gray-200">
                            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                                {activeTabs.map((tab) => (
                                <button
                                    key={tab.name}
                                    id={tab.name}
                                    className={classNames(
                                    tab.current
                                        ? 'border-gray-500 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                                    'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-light'
                                    )}
                                    aria-current={tab.current ? 'page' : undefined}
                                    style={{color: tab.color}}
                                    onClick={handleClick}
                                >
                                    {tab.name}
                                </button>
                                ))}
                            </nav>
                        </div>
                    </div>
                </>
            ) : null}
            <div>
                {activeTabs ? activeTabs.map((tab) => (
                    <div className={tab.current ? 'block' : 'hidden'} key={tab.name}>
                        <div className='mt-6' dangerouslySetInnerHTML={{__html: tab.body}}></div>
                    </div>
                    )
                ) : null
                }
            </div>
        </>
    )
}