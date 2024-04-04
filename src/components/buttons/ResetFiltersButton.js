

export default function ResetFilterButton(props) {
    function handleClick(e) {

        // Reset the themes
        const newThemeFilter = {}
        Object.keys(props.themes).forEach(key => {
            newThemeFilter[key] = props.themes[key]
            newThemeFilter[key].active = true
        })
        props.setActiveThemes(newThemeFilter)

        // Reset the tags
        const newTagFilter = {}
        Object.keys(props.tags).forEach(key => {
            newTagFilter[key] = props.tags[key]
            newTagFilter[key].active = true
        })
        props.setActiveTags(newTagFilter)

        props.setIsThemeFiltered(false)
        props.setIsTagFiltered(false)
        props.setIsReset(true)
    }

    return (
        <button 
            className="bg-gray-200 py-0.5 px-1 rounded-sm absolute top-2 right-2 text-xs disabled:bg-gray-100 disabled:text-gray-200"
            onClick={handleClick}
            disabled={props.isThemeFiltered || props.isTagFiltered ? false : true}
        >
            Reset Filters
        </button>
    )
}