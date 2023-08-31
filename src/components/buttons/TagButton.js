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
                props.active 
                ? "p-0.5 text-xs m-0.5 rounded-lg bg-slate-300 hover:bg-slate-200" 
                : "p-0.5 text-xs m-0.5 rounded-lg bg-slate-100 hover:bg-slate-200"
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