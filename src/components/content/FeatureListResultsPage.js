import useFeatureList from "@/apicalls/useFeatureList"
import FeatureThumbnail from "./FeatureThumbnail"
import LoadingSpinner from "./LoadingSpinner"
import NotFound from "./NotFound"

export default function FeatureListResultsPage(props) {

    const {data, isError, isLoading} = useFeatureList(
        {
            page: props.page, 
            limit: 20, 
            themes: props.activeThemes, 
            tags: props.activeTags
        }
    )

    if (isLoading) {
        return <div className="w-full flex justify-center items-center"><div className="w-16 h-16"><LoadingSpinner className="text-gray-100"/></div></div>
    }

    if (isError) {
        props.setHasMore(false)
        return <NotFound link='/entries/' />
    }

    if (!data.features) {
        props.setHasMore(false)
        props.setFeatureCount(0)
        return(<NotFound link='/entries/' />)
    }

    if (data.features.length == 0) {
        props.setHasMore(false)
        props.setFeatureCount(0)
        return(<NotFound link='/entries/' />)
    }

    if (data.totalPages == props.page) {
        props.setHasMore(false)
    } else {
        props.setHasMore(true)
    }

    if (data.featureCount) {
        props.setFeatureCount(data.featureCount)
    }

    return (
        <>{data.features.length > 0 ? data.features.map(f => (<FeatureThumbnail key={f.properties.uuid} feature={f} />)): <NotFound />}</>
    )
}