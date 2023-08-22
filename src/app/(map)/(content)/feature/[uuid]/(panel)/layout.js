"use client"
import { useContext, useEffect } from "react"
import useFeature from "@/apicalls/useFeature"
import { ActiveFeature } from "@/app/(map)/layout"

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}


export default function PanelLayout({params, children}) {

    const {setActiveFeature} = useContext(ActiveFeature)
    const {activeFeature} = useContext(ActiveFeature)
    
    useEffect(() => {
        if (!activeFeature) {
            setTimeout(() => {
                setActiveFeature(params.uuid)
            }, 2000)
        }
    }, [activeFeature])
    
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