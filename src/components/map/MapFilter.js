import { useState } from "react"
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/20/solid"
import ThemeButton from "../buttons/ThemeButton"
import TagButton from "../buttons/TagButton"
import ResetFilterButton from "../buttons/ResetFiltersButton"


export default function MapFilter(props) {

    const [showTags, setShowTags] = useState(false)

    // These check if any themes or tags are active so the filters can be additive as soon as a user starts turning things on or off.
    const [isThemeFiltered, setIsThemeFiltered] = useState(false)
    const [isTagFiltered, setIsTagFiltered] = useState(false)

    function handleClick(e) {
        showTags ? setShowTags(false) : setShowTags(true)
    }

    return (
        <div className="w-1/3 bg-stone-50 rounded absolute bottom-6 right-6 p-1 hidden sm:block">
            <div className="mb-2">
                <ResetFilterButton 
                    isThemeFiltered={isThemeFiltered} 
                    isTagFiltered={isTagFiltered} 
                    setIsThemeFiltered={setIsThemeFiltered} 
                    setIsTagFiltered={setIsTagFiltered} 
                    themes={props.themes} 
                    tags={props.activeTags} 
                    setActiveThemes={props.setActiveThemes}
                    setActiveTags={props.setActiveTags}
                />
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
                            isFiltered={isThemeFiltered}
                            setIsFiltered={setIsThemeFiltered}
                        /> 
                    )
                }) : null}
            </div>
            <div className="flex flex-row">
                <h4>Filter by {props.tagLists ? Object.keys(props.tagLists).map((key, index) => {
                    if (index == Object.keys(props.tagLists).length -1) {
                        return (props.tagLists[key].name)
                    } else {
                        return (props.tagLists[key].name + ', ')
                    }
                    }) : null}</h4>
                <ChevronRightIcon className={showTags ? "hidden h-7" : "visible h-7"} onClick={handleClick}/>
                <ChevronDownIcon className={showTags ? "visible h-7" : "hidden h-7"} onClick={handleClick}/>
            </div>
            <div className={showTags ? "visible" : "hidden"}>
            {props.tagLists ? Object.keys(props.tagLists).map(key => {
                const tagObj = props.tagLists[key]
                let tagList = Object.keys(tagObj.tags).map(t => ({...tagObj.tags[t], id: t}))
                /* Put the tags in alphabetical order */
                tagList.sort((a, b) => {
                    let na = a.name.toLowerCase(), nb = b.name.toLowerCase()
                    
                    if (na < nb) {
                        return -1
                    }
                    if (na > nb) {
                        return 1
                    }
                    return 0
                })
                
                return (
                    <div key={key} className="mb-3">
                        <h5>{tagObj.name}</h5>
                        {tagList.map(t => (
                                <TagButton 
                                    key={t.id} 
                                    name={t.name}
                                    setActiveTags={props.setActiveTags}
                                    activeTags={props.activeTags}
                                    id={t.id}
                                    /* the active state from the grouped tagLists is ignored and mapped to the flat object containing the tag states instead. Why? because the grouped tagLists are used for layout but is hard to manipulate, whilst the flat list is easy. */
                                    active={props.activeTags[t.id].active}
                                    isFiltered={isTagFiltered}
                                    setIsFiltered={setIsTagFiltered}
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