"use client"
import { useContext, useEffect } from "react"
import { ActiveFeatureContext } from "@/app/providers"

export default function ActiveFeatureConsumer({children}, props) {
    const {setActiveFeature} = useContext(ActiveFeatureContext)

    useEffect(() => {
        setActiveFeature({feature: props.uuid, slug: props.slug})
    }, [])
    
    return (
        <div>{children}</div>
    )
}