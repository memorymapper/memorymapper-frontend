import useFeature from "@/apicalls/useFeature"
import LoadingSpinner from "./LoadingSpinner"
import Link from "next/link"

export default function MultipleResultsFeatureCard(props) {

    const {feature, loading, error} = useFeature(props.uuid)

    if (error) {
        return <LoadingSpinner />
    }

    if (loading) {
        return <LoadingSpinner />
    }

    return (
        <div>
            {feature ? <div className="p-2 bg-white my-1 rounded-sm border border-slate-100"><Link style={{'color': feature.properties.color}} href={`/feature/${props.uuid}/${feature.properties.attachments.split(',')[0]}`}>{feature.properties.name}</Link></div> : null}</div>
    )
}