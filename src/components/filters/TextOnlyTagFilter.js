export default function TextOnlyTagFilter(props) {
    return (
        <div>
            <h2>{props.name}</h2>
            <ul>
                {Object.keys(props.tags).map(key => (
                    <li key={key}>{props.tags[key].name}</li>
                ))}
            </ul>
        </div>
    )
}