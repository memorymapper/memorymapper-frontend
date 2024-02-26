"use client"
import useSiteConfig from '@/apicalls/useSiteConfig'
import { useState, createContext, useContext } from 'react'
import MapDisplay from '@/components/map/MapDisplay'
import CommandPalette from '@/components/search/CommandPalette'
import { PanelSizeContext } from '@/app/providers'
import LoadingSpinner from '@/components/content/LoadingSpinner'
import WelcomeModal from '@/components/content/WelcomeModal'


export const SiteConfigContext = createContext(null)
export const PanelOffsetContext = createContext(null)

export default function MapLayout({children}) {

    const [panelOffset, setPanelOffset] = useState(0)

    const {panelSize, setPanelSize} = useContext(PanelSizeContext)
    
    const {siteConfig, isLoading, isError} = useSiteConfig()

    if (isLoading) return <div className='w-full flex justify-center items-center'><div className="w-16 h-16"><LoadingSpinner /></div></div>
    if (isError) return <h1>Error...</h1>

    return (
        <SiteConfigContext.Provider value={siteConfig}>
            <WelcomeModal 
                siteTitle={siteConfig.SITE_TITLE} 
                siteSubtitle={siteConfig.SITE_SUBTITLE}
                logo={siteConfig.LOGO_IMAGE}
            />
            <PanelOffsetContext.Provider value={{panelOffset, setPanelOffset}}>
                <CommandPalette 
                    mapCenter={[siteConfig.MAP_CENTER_LONGITUDE, siteConfig.MAP_CENTER_LATITUDE]}
                    mapZoom={siteConfig.ZOOM}  
                />
                <main className="h-[calc(100%-4rem)] block relative">
                        { children }
                        <MapDisplay 
                            panelOffset={panelOffset} 
                            panelSize={panelSize}
                            setPanelSize={setPanelSize}
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
    )
}
