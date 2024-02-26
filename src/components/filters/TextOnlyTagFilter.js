import { useState } from "react"
import { XMarkIcon } from "@heroicons/react/24/outline"

export default function TextOnlyTagFilter(props) {

    const [isFiltered, setIsFiltered] = useState(false)

    const onClick = function(e) {
        const tag = e.target.getAttribute('data-tag')
        props.setPage(1)
        if (!isFiltered) {
            props.setActiveTags([tag])
            setIsFiltered(true)
            return
        }
        if (props.activeTags.includes(tag)) {
            const index = props.activeTags.indexOf(tag)
            const newTags = [...props.activeTags]
            newTags.splice(index, 1)
            props.setActiveTags(newTags)
        } else {
            props.setActiveTags([...props.activeTags, tag])
        }   
    }

    const reset = function(e) {
        props.setActiveTags(Object.keys(props.tags).map(key => props.tags[key].name))
        props.setPage(1)
        setIsFiltered(false)
    }

    return (
        <div>
            <div className="flex flex-row justify-between items-center mb-2">
                <h2 className='font-thin text-xl'>{props.name}</h2>
                <XMarkIcon className={isFiltered ? "w-6 h-6 text-gray-600 cursor-pointer" : "w-6 h-6 text-gray-200"} onClick={reset}/>
            </div>
            <div className="flex w-full flex-wrap">
                {Object.keys(props.tags).map(key => (
                    <div 
                        className={
                            props.activeTags.includes(props.tags[key].name) 
                            ? "text-sm font-light text-gray-600 cursor-pointer bg-gray-100 hover:bg-gray-50 rounded-sm mb-1 mr-1 px-2"
                            : "text-sm font-light text-gray-100 cursor-pointer bg-gray-50 rounded-sm mb-1 mr-1 px-2"
                        } 
                        key={key}
                        data-tag={props.tags[key].name}
                        onClick={onClick}
                    >
                        {props.tags[key].name}
                    </div>
                ))}
            </div>
        </div>
    )
}