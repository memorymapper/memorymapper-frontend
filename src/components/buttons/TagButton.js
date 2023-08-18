function changeState(setActiveTags, active, activeTags, id, name) {
    if (active) {
        setActiveTags({...activeTags, [id]: {name: name, active: false }})
    } else {
        setActiveTags({...activeTags, [id]: {name: name, active: true }})
    }
}

export default function TagButton(props) {

    return (
        <button 
            className={
                props.active ? 
                "p-1 text-xs m-0.5 rounded-xl bg-slate-300" 
                : "p-1 text-xs m-0.5 rounded-xl bg-slate-100"
            } 
            onClick={() => changeState(
                props.setActiveTags, 
                props.active, 
                props.activeTags, 
                props.id, 
                props.name 
            )} 
            >
            {'#' + props.name}
        </button>
    )
} 