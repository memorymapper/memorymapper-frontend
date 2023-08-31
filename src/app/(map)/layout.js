"use client"
import useSiteConfig from '@/apicalls/useSiteConfig'
import { useState, createContext, useContext } from 'react'
import MapDisplay from '@/components/map/MapDisplay'
import CommandPalette from '@/components/search/CommandPalette'

export const PanelWidthContext = createContext(null)
export const SiteConfigContext = createContext(null)
export const PanelOffsetContext = createContext(null)

export default function MapLayout({children}) {

    const [panelWidth, setPanelWidth] = useState('w-1/3')
    const [panelOffset, setPanelOffset] = useState(0)
    
    const {siteConfig, isLoading, isError} = useSiteConfig()
    if (isLoading) return <h1>Loading...</h1>
    if (isError) return <h1>Error...</h1>

    return (
        <PanelWidthContext.Provider value={{panelWidth, setPanelWidth}}>
            <SiteConfigContext.Provider value={siteConfig}>
                <PanelOffsetContext.Provider value={{panelOffset, setPanelOffset}}>
                    <CommandPalette />
                    <main className="h-[calc(100%-3rem)] block relative">
                            { children }
                            <MapDisplay 
                                panelOffset={panelOffset} 
                                mapCenter={[siteConfig.MAP_CENTER_LONGITUDE, siteConfig.MAP_CENTER_LATITUDE]} 
                                mapZoom={siteConfig.ZOOM} 
                                apiKey={siteConfig.MAPTILER_KEY} 
                                tileJson={siteConfig.TILE_JSON_URL} 
                                themes={siteConfig.themes} 
                                tagLists={siteConfig.tagLists} 
                            />
                    </main>
                </PanelOffsetContext.Provider>
            </SiteConfigContext.Provider>
        </PanelWidthContext.Provider>
    )
}
