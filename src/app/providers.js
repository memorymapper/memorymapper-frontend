"use client"
import { createContext, useState, useRef } from "react"

export const CommandPaletteContext = createContext()
export const ActiveFeatureContext = createContext()
export const MapContext = createContext()
export const PanelSizeContext = createContext(null)

export const panelClassNames = {
    hidden: 'z-10 absolute bottom-0 left-0 sm:relative pointer-events-auto bg-stone-50 p-6 border-t border-stone-200 sm:border-0 w-full sm:w-12 sm:h-full h-24',
    medium: 'z-10 absolute bottom-0 left-0 sm:relative pointer-events-auto bg-stone-50 p-6 border-t border-stone-200 sm:border-0 w-full sm:w-1/3 sm:h-full h-[calc(100%-1rem)]',
    large:  'z-10 absolute bottom-0 left-0 sm:relative pointer-events-auto bg-stone-50 p-6 border-t border-stone-200 sm:border-0 sm:w-1/2 sm:h-full h-[calc(100%-1rem)]'
}


export default function Providers({children}) {
    
    const [panelSize, setPanelSize] = useState(panelClassNames.medium)
    const [showCommandPalette, setShowCommandPalette] = useState(false)
    const [activeFeature, setActiveFeature] = useState(null)
    const mapRef = useRef(null)

    return (
        <CommandPaletteContext.Provider value={{open: showCommandPalette, setOpen: setShowCommandPalette}}>
            <ActiveFeatureContext.Provider value={{activeFeature: activeFeature, setActiveFeature: setActiveFeature}}>
                <MapContext.Provider value={{map: mapRef}}>
                    <PanelSizeContext.Provider value={{panelSize: panelSize, setPanelSize: setPanelSize}}>
                        { children }
                    </PanelSizeContext.Provider>
                </MapContext.Provider>
            </ActiveFeatureContext.Provider>
        </CommandPaletteContext.Provider>
    )
}