import Breadcrumbs from "../nav/Breadcrumbs"
import { useState } from "react"
import FeatureListResultsPage from "./FeatureListResultsPage"

export default function FeatureList(props) {

    const [hasMore, setHasMore] = useState(true)

    const pages = []

    for (let i=1; i <= props.page; i++) {
        if (props.filterReset) {
            pages.push(<FeatureListResultsPage page={i} setHasMore={setHasMore} key={i} />)
        } else {
            pages.push(<FeatureListResultsPage page={i} setHasMore={setHasMore} activeThemes={props.activeThemes} activeTags={props.activeTags} key={i} />)
        }
    }


    return (
        <>
            <Breadcrumbs pages={[{name: 'Entries', href: '/entries', current: true}]} />
            <div className="grid md:grid-cols-3 gap-4">
                {pages.length ? pages : null}
            </div>
            {hasMore ?
                <button
                    type="button"
                    className={
                        hasMore
                            ? "rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 w-full mt-8"
                            : "rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-200 shadow-sm ring-1 ring-inset ring-gray-300 bg-gray-50 w-full mt-8"
                    }
                    onClick={() => props.setPage(props.page + 1)}
                >
                    Load More
                </button>
            : null }   
        </>
    )
}
