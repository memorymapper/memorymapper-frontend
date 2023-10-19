"use client"
import { useRef, useEffect, useContext, Suspense } from 'react'
import { PanelSizeContext } from '@/app/providers'
import { PanelOffsetContext } from '@/app/(map)/(root)/layout'
import PanelToggle from '@/components/buttons/PanelToggle'
import MobilePanelToggle from '@/components/buttons/MobilePanelToggle'

export default function ContentLayout({children}) {
    
    const {panelSize, setPanelSize} = useContext(PanelSizeContext)
    const {setPanelOffset} = useContext(PanelOffsetContext)

    const panelContainer = useRef(null)    
    
    useEffect(() => {
        if (panelContainer.current) {
          setPanelOffset(panelContainer.current.offsetWidth)
        }
    }, [panelSize, setPanelOffset])

    return (
        <div className="w-full h-full absolute z-[10] pointer-events-none">
            <div className={panelSize} 
            ref={panelContainer}>
              <PanelToggle panelSize={panelSize} setPanelSize={setPanelSize} />
              <MobilePanelToggle panelSize={panelSize} setPanelSize={setPanelSize}  />
              <Suspense fallback={<p>Loading...</p>}>
                { children }
              </Suspense>
            </div>
        </div>
    )
}

        