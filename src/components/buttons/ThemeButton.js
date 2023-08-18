function changeState(setActiveThemes, active, themes, id, color, name) {
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
                props.name 
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