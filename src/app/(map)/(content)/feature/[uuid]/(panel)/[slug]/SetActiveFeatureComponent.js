"use client"
import { useContext, useEffect } from "react"
import { ActiveFeatureContext } from "@/app/providers"
import { useParams } from "next/navigation"


export default function SetActiveFeatureComponent() {
    const params = useParams()
    const {activeFeature, setActiveFeature} = useContext(ActiveFeatureContext)

    useEffect(() => {
        // Sets the active feature on page load. Uses a timeout because otherwise it won't fire if the map isn't loaded. This is very inelegant but I can't find a way round it...
        // Todo: work out a better way of doing this. I think the problem is to do with the order the components render, because either the map isn't available or the activeFeature isn't available depending on the order in which they load.
        if (!activeFeature) { 
            setTimeout(() => {
                setActiveFeature({feature: params.uuid, slug: params.slug})
            }, 1500)
        }
    }, [])
    

    return (<></>)
}