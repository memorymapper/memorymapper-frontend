import { useState } from "react"
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/20/solid"
import ThemeButton from "../buttons/ThemeButton"
import TagButton from "../buttons/TagButton"


export default function MapFilter(props) {

    const [showTags, setShowTags] = useState(false)

    function handleClick(e) {
        showTags ? setShowTags(false) : setShowTags(true)
    }

    return (
        <div className="w-1/3 bg-stone-50 rounded absolute bottom-6 right-6 p-1">
            <div className="mb-2">
                <h3>Themes</h3>
                {props.themes ? Object.keys(props.themes).map(key => {
                    return (
                        <ThemeButton 
                            key={key} 
                            name={props.themes[key].name} 
                            active={props.themes[key].active} 
                            setActiveThemes={props.setActiveThemes} 
                            themes={props.themes} 
                            id={key} 
                            color={props.themes[key].color} 
                        /> 
                    )
                }) : null}
            </div>
            <div className="flex flex-row">
                <h4>Filter by {props.tagLists ? Object.keys(props.tagLists).map(key => ( props.tagLists[key].name + ', ' )) : null}</h4>
                <ChevronRightIcon className={showTags ? "hidden h-7" : "visible h-7"} onClick={handleClick}/>
                <ChevronDownIcon className={showTags ? "visible h-7" : "hidden h-7"} onClick={handleClick}/>
            </div>
            <div className={showTags ? "visible" : "hidden"}>
            {props.tagLists ? Object.keys(props.tagLists).map(key => {
                const tagList = props.tagLists[key]
                return (
                    <div key={key} className="mb-3">
                        <h5>{tagList.name}</h5>
                        {Object.keys(tagList.tags).map(t => (
                                <TagButton 
                                    key={t} 
                                    name={tagList.tags[t].name}
                                    setActiveTags={props.setActiveTags}
                                    activeTags={props.activeTags}
                                    id={t}
                                    /* the active state from the grouped tagLists is ignored and mapped to the flat object containing the tag states instead. Why? because the grouped tagLists are used for layout but is fragile to manipulate, whilst the flat list is easy to parse. */
                                    active={props.activeTags[t].active}
                                    /*available={props.availableTagList}*/
                                />
                            )   
                        )}
                    </div>
                )
            }) : null}
            </div>
        </div>
    )
}