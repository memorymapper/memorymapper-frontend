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
        return <NotFound />
    }

    if (data == 'No Results') {
        return(<NotFound />)
    }

    if (data.totalPages == props.page) {
        props.setHasMore(false)
    } else {
        props.setHasMore(true)
    }

    return (
        <>{data.features.length > 0 ? data.features.map(f => (<FeatureThumbnail key={f.properties.uuid} feature={f} />)): <NotFound />}</>
    )
}