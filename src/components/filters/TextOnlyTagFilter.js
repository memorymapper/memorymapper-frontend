import { useState, useEffect } from "react"
import { XMarkIcon } from "@heroicons/react/24/outline"

export default function TextOnlyTagFilter(props) {

    const [isFiltered, setIsFiltered] = useState(false)

    const [thisFilterActiveTags, setThisFilterActiveTags] = useState(Object.keys(props.tags).map(key => props.tags[key].name))

    const flatTagList = Object.keys(props.tags).map(key => props.tags[key].name)

    const onClick = function(e) {
        const tag = e.target.getAttribute('data-tag')
        // Expected behaviour: if none of the tags are active, make the clicked on tag the only tag
        if (!isFiltered) {
            setThisFilterActiveTags([tag])
            return
        }
        // If the tag is active (ie. is in the thisFilterActiveTags array), deactivate it by removing it from the array
        if (thisFilterActiveTags.includes(tag)) {
            const index = thisFilterActiveTags.indexOf(tag)
            const thisFilterNewTags = thisFilterActiveTags.toSpliced(index, 1)
            setThisFilterActiveTags(thisFilterNewTags)
        // If the tag isn't active, add it to the activeTagLists, locally and for the whole text browse interface...
        } else {
            const newTags = [...new Set([...props.activeTags, tag])]
            setThisFilterActiveTags([tag, ...thisFilterActiveTags])
        }
    }

    const reset = function(e) {
        if (!isFiltered) {
            setThisFilterActiveTags([])
            setIsFiltered(true)
            props.setPage(1)
        } else {
            setThisFilterActiveTags(flatTagList)
            setIsFiltered(false)
            props.setPage(1)
        }
    }

    useEffect(() => {
        // Update all the tags when thisFilterActiveTags change
        // Logic: first remove all the tags for this tag filter from props.activeTags, then add back only the active ones
        // So: if the current activeTag is in the flatTagList for this filter, don't include it in the new list, otherwise do
        // This should result in a set of new tags that only contains the intersection of the active filters
        const allTagsMinusTagsForThisFilter = props.activeTags.filter(t => flatTagList.includes(t) ? null : t)
        const allNewTags = [...new Set([...allTagsMinusTagsForThisFilter,  ...thisFilterActiveTags])]
        props.setPage(1)
        props.setActiveTags(allNewTags)
        if (flatTagList.length == thisFilterActiveTags.length) {
            setIsFiltered(false)    
        } else {
            setIsFiltered(true)
        }
    }, [thisFilterActiveTags])

    return (
        <div className="w-full">
            <div className="flex flex-row justify-between items-center mb-2">
                <h2 className='font-thin text-xl'>{props.name}</h2>
                <XMarkIcon className="w-6 h-6 text-gray-600 cursor-pointer" onClick={reset}/>
            </div>
            <div className="flex w-full flex-wrap">
                {flatTagList.map(t => (
                    <div 
                        className={
                            thisFilterActiveTags.includes(t) 
                            ? "text-sm font-light text-gray-600 cursor-pointer bg-gray-100 hover:bg-gray-50 rounded-sm mb-1 mr-1 px-2"
                            : "text-sm font-light text-gray-100 cursor-pointer bg-gray-50 rounded-sm mb-1 mr-1 px-2"
                        } 
                        key={t}
                        data-tag={t}
                        onClick={onClick}
                    >
                        {t}
                    </div>
                ))}
            </div>
        </div>
    )
}