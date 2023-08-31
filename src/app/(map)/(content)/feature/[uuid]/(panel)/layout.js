"use client"
import { useContext, useEffect } from "react"
import { useParams } from 'next/navigation'
import useFeature from "@/apicalls/useFeature"
import { ActiveFeatureContext } from "@/app/providers"
import { MapContext } from "@/app/providers"

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}


export default function PanelLayout({children}) {

    const params = useParams()
    
    const {activeFeature} = useContext(ActiveFeatureContext)
    const {setActiveFeature} = useContext(ActiveFeatureContext)
    const {map} = useContext(MapContext)
    
    /*
    useEffect(() => {
        if (!activeFeature) {
            setActiveFeature(params.uuid)
        }
    }, [activeFeature])
    */
    
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
            <h2>{ feature ? feature.properties.name : null }</h2>
            {children}
        </div>
    )
}