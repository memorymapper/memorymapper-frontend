import ThemeButton from "../buttons/ThemeButton"
import TagButton from "../buttons/TagButton"

export default function MapFilter(props) {

    return (
        <div className="w-1/3 bg-white absolute bottom-6 right-6 p-1">
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
            {props.tagLists ? Object.keys(props.tagLists).map(key => {
                const tagList = props.tagLists[key]
                return (
                    <div key={key}>
                        <h3>{tagList.name}</h3>
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
    )
}