"use client"
import { useState, useRef, useEffect, useContext, Suspense, createContext } from 'react'
import { PanelWidthContext } from '@/app/(map)/layout'
import { PanelOffsetContext } from '@/app/(map)/layout'
import PanelToggle from '@/components/buttons/PanelToggle'

export default function ContentLayout({children}) {
    
    const {panelWidth} = useContext(PanelWidthContext)
    const {setPanelWidth} = useContext(PanelWidthContext)
    const {panelOffset} = useContext(PanelOffsetContext)
    const {setPanelOffset} = useContext(PanelOffsetContext)

    const panelContainer = useRef(null)    
    
    useEffect(() => {
        if (panelContainer.current) {
        setPanelOffset(panelContainer.current.offsetWidth)
        }
    }, [panelWidth])

    return (
        <div className="w-full h-full absolute z-40 pointer-events-none">
            <div className={panelWidth + ' h-full relative pointer-events-auto bg-stone-50 p-6'} ref={panelContainer}>
              <PanelToggle panelWidth={panelWidth} setPanelWidth={setPanelWidth} />
              <Suspense fallback={<p>Loading...</p>}>
                { children }
              </Suspense>
            </div>
        </div>
    )
}

        