function changeState(stateToChange, current, options) {
    options.forEach(element => {
        if (element != current) {
            stateToChange(element)
        }
    });

}

export default function ButtonSmall(props) {
    return (
        <button className="bg-grey-50 p-2" onClick={() => changeState(props.stateToChange, props.current, props.options)}>
            {props.title}
        </button>
    )
} 