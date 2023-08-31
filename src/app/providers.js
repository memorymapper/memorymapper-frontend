"use client"
import { createContext, useState, useRef } from "react"

export const CommandPaletteContext = createContext()
export const ActiveFeatureContext = createContext()
export const MapContext = createContext()

export default function Providers({children}) {
    
    const [showCommandPalette, setShowCommandPalette] = useState(false)
    const [activeFeature, setActiveFeature] = useState(null)
    const mapRef = useRef(null)

    return (
        <CommandPaletteContext.Provider value={{open: showCommandPalette, setOpen: setShowCommandPalette}}>
            <ActiveFeatureContext.Provider value={{activeFeature: activeFeature, setActiveFeature: setActiveFeature}}>
                <MapContext.Provider value={{map: mapRef}}>
                    { children }
                </MapContext.Provider>
            </ActiveFeatureContext.Provider>
        </CommandPaletteContext.Provider>
    )
}