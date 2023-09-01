"use client"
import { useRef, useEffect, useContext, Suspense } from 'react'
import { PanelWidthContext } from '@/app/(map)/layout'
import { PanelOffsetContext } from '@/app/(map)/layout'
import PanelToggle from '@/components/buttons/PanelToggle'

export default function ContentLayout({children}) {
    
    const {panelWidth} = useContext(PanelWidthContext)
    const {setPanelWidth} = useContext(PanelWidthContext)
    const {setPanelOffset} = useContext(PanelOffsetContext)

    const panelContainer = useRef(null)    
    
    useEffect(() => {
        if (panelContainer.current) {
        setPanelOffset(panelContainer.current.offsetWidth)
        }
    }, [panelWidth, setPanelOffset])

    return (
        <div className="w-full h-full absolute z-[10] pointer-events-none">
            <div className={`z-10 ${panelWidth} h-[calc(100%-1rem)] sm:h-full absolute bottom-0 left-0 sm:relative pointer-events-auto bg-stone-50 p-6 border-t border-stone-200 sm:border-0`} 
            ref={panelContainer}>
              <PanelToggle panelWidth={panelWidth} setPanelWidth={setPanelWidth} />
              <Suspense fallback={<p>Loading...</p>}>
                { children }
              </Suspense>
            </div>
        </div>
    )
}

        