function changeState(setActiveThemes, active, themes, id, color, name, isFiltered, setIsFiltered) {

    if (!isFiltered) {
        const newThemeFilter = {}
        // I'm sure I could do this with a ... but my brain isn't there today...
        Object.keys(themes).forEach(key => {
            newThemeFilter[key] = themes[key]
            key != id 
            ? newThemeFilter[key].active = false 
            : newThemeFilter[key].active = true
        })
        setActiveThemes(newThemeFilter)
        setIsFiltered(true)
        return
    }

    if (active) {
        setActiveThemes({...themes, [id]: {name: name, active: false, color: color }})
    } else {
        setActiveThemes({...themes, [id]: {name: name, active: true, color: color }})
    }
}

export default function ThemeButton(props) {

    return (
        <button 
        className={
            props.active 
                ? "p-1 text-xs border m-0.5 rounded-sm text-gray-100" 
                : "p-1 text-xs border m-0.5 bg-gray-100 rounded-sm"
            } 
            onClick={() => changeState(
                props.setActiveThemes, 
                props.active, 
                props.themes, 
                props.id, 
                props.color, 
                props.name,
                props.isFiltered,
                props.setIsFiltered
            )} 
            style={
                {'backgroundColor': props.active 
                ? props.color 
                : '#c1c1c1'}
            }>
            {props.name}
        </button>
    )
} 