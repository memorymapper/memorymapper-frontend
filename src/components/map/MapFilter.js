import { useState } from "react"
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/20/solid"
import ThemeButton from "../buttons/ThemeButton"
import TagButton from "../buttons/TagButton"
import ResetFilterButton from "../buttons/ResetFiltersButton"


export default function MapFilter(props) {

    const [showTags, setShowTags] = useState(false)
    const [showMapLayers, setShowMapLayers] = useState(false)
    const [showPanel, setShowPanel] = useState(true)

    // These check if any themes or tags are active so the filters can be additive as soon as a user starts turning things on or off.
    const [isThemeFiltered, setIsThemeFiltered] = useState(false)
    const [isTagFiltered, setIsTagFiltered] = useState(false)

    function tagPanelToggle(e) {
        showTags ? setShowTags(false) : setShowTags(true)
    }

    function panelToggle(e) {
        showPanel ? setShowPanel(false): setShowPanel(true)
    }

    function mapLayerPanelToggle(e) {
        showMapLayers ? setShowMapLayers(false) : setShowMapLayers(true)
    }

    function mapLayerToggle(e) {
        const slug = e.target.getAttribute('id')
        if (props.mapLayerWidget == 'CHECKBOX') {
            const newMapLayers = props.mapLayers.map(l => {
                if (l.slug == slug) {
                    return {'name': l.name, 'slug': l.slug, 'visibility': l.visibility == 'visible' ? 'none' : 'visible'}
                } else {
                    return l
                }
            })
            props.setActiveLayers(newMapLayers)
        }
        else if (props.mapLayerWidget == 'RADIO') {
            const newMapLayers = props.mapLayers.map(l => {
                if (l.slug == slug) {
                    return {'name': l.name, 'slug': l.slug, 'visibility': 'visible'}
                } else {
                    return {'name': l.name, 'slug': l.slug, 'visibility': 'none'}
                }
            })
            props.setActiveLayers(newMapLayers)
        }
    }

    return (
        <div className="w-1/3 bg-stone-50 rounded absolute bottom-6 right-6 p-1 hidden sm:block">
            <div className="border-b border-stone-100 flex flex-row justify-between items-center">
                <h3 className="">Filters</h3>
                <div className="flex flex-row justify-between h-full mb-2 space-x-1">
                    <div className={showPanel ? "visible" : "hidden"}>
                        <ResetFilterButton 
                            isThemeFiltered={isThemeFiltered} 
                            isTagFiltered={isTagFiltered} 
                            setIsThemeFiltered={setIsThemeFiltered} 
                            setIsTagFiltered={setIsTagFiltered} 
                            themes={props.themes} 
                            tags={props.activeTags} 
                            setActiveThemes={props.setActiveThemes}
                            setActiveTags={props.setActiveTags}
                            setIsReset={props.setIsReset}
                        />
                    </div>
                    <button 
                className={showPanel ? "visible bg-gray-200 rounded-sm text-xs p-1 disabled:bg-gray-100 disabled:text-gray-200" : "hidden"} onClick={panelToggle}>Hide</button>
                    <button 
                className={!showPanel ? "visible bg-gray-200 rounded-sm text-xs p-1 disabled:bg-gray-100 disabled:text-gray-200" : "hidden"} onClick={panelToggle}>Show</button>
                </div>
            </div>
            <div className={showPanel ? "visible" : "hidden"}>
                <div className="mb-2">
                    <h4>Themes</h4>
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
                { Object.keys(props.tagLists).length > 0 ? 
                (<div className="flex flex-row">
                    <h4>Filter by {props.tagLists ? Object.keys(props.tagLists).map((key, index) => {
                        if (index == Object.keys(props.tagLists).length -1) {
                            return (props.tagLists[key].name)
                        } else {
                            return (props.tagLists[key].name + ', ')
                        }
                        }) : null}</h4>
                    <ChevronRightIcon className={showTags ? "hidden h-7" : "visible h-7"} onClick={tagPanelToggle}/>
                    <ChevronDownIcon className={showTags ? "visible h-7" : "hidden h-7"} onClick={tagPanelToggle}/>
                </div>)
                : null }
                <div className={showTags ? "visible h-40 overflow-auto" : "hidden"}>
                {props.tagLists ? Object.keys(props.tagLists).map((key, i) => {
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
                            {i == 0 ? null : <h5>{tagObj.name}</h5>}
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
                {props.mapLayers.length > 0 ? (
                <div className="flex flex-row">
                    <h4>Map Layers</h4>
                    <ChevronRightIcon className={showMapLayers ? "hidden h-7" : "visible h-7"} onClick={mapLayerPanelToggle}/>
                    <ChevronDownIcon className={showMapLayers ? "visible h-7" : "hidden h-7"} onClick={mapLayerPanelToggle}/>
                </div>)
                : null}
                <div className={showMapLayers ? "visible" : "hidden"}>
                {props.mapLayerWidget == 'CHECKBOX' ? (
                    <ul className="mb-2">
                    {props.mapLayers ? props.mapLayers.map(l => (
                        <li key={l.slug} className="flex items-center">
                            <input 
                                type="checkbox" 
                                className="form-input rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50" 
                                id={l.slug} name={l.name} 
                                defaultChecked={l.visibility == 'visible' ? true : false}
                                value={l.visibility}
                                onChange={mapLayerToggle}
                            />
                            <label htmlFor={l.slug} className="text-sm ml-2">
                                {l.name}
                            </label>
                        </li>
                    )): null}
                    </ul>
                ) : null}
                {props.mapLayerWidget == 'RADIO' ? (
                    <ul className="mb-2">
                        {props.mapLayers ? props.mapLayers.map((l, i) => (
                            <li key={l.slug} className="flex items-center">
                                <input 
                                    type="radio"
                                    name="mapLayers"
                                    id={l.slug}
                                    defaultChecked={l.visibility == 'visible' ? true : false}
                                    value={l.visibility}
                                    onChange={mapLayerToggle}
                                />
                                <label htmlFor={l.slug} className="text-sm ml-2">
                                    {l.name}
                                </label>
                            </li>
                        )) : null}
                        <li key="none" className="flex items-center">
                            <input 
                                type="radio"
                                name="mapLayers"
                                id="none"
                                defaultChecked={false}
                                value="none"
                                onChange={mapLayerToggle}
                            />
                            <label htmlFor="none" className="text-sm ml-2">
                                None
                            </label>
                        </li>
                    </ul>
                ) : null}
                </div>
            </div>   
        </div>
    )
}