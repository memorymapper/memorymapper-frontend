"use client"
import { useParams } from 'next/navigation'
import useFeature from "@/apicalls/useFeature"

export default function PanelLayout({children}) {

    const params = useParams()

    const {feature, isLoading, isError} = useFeature(params.uuid)

    if (isLoading) {
        return (
            <div>Loading...</div>
        )
    }

    if (isError) {
        return (
            <div>Error...</div>
        )
    }

    return (
        <div className="h-full overflow-hidden">
            <h2 style={{color: feature.properties.color}}>{ feature ? feature.properties.name : null }</h2>
            {children}
        </div>
    )
}