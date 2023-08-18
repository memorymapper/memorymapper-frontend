export default function TabContent(props) {
    return (
        <div className={props.current ? 'visible' : 'hidden'}>
            <h3>{props.title}</h3>
        </div>
    )
}