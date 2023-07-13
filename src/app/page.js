"use client"
import { useState, useRef, useEffect } from 'react'
import NavBar from '@/components/nav/NavBar'
import MapDisplay from '@/components/map/MapDisplay'
import PanelToggle from '@/components/buttons/PanelToggle'

export default function Home() {

  const [panelWidth, setPanelWidth] = useState('w-1/3')
  const [panelOffset, setPanelOffset] = useState(0)
  const panelContainer = useRef(null)

  useEffect(() => {
    setPanelOffset(panelContainer.current.offsetWidth)
  }, [panelWidth])

  return (
    <>
      <NavBar />
      <main className="h-[calc(100%-3rem)] block relative">
        <div className="w-full h-full absolute z-40">
            <section className={panelWidth + ' h-full relative bg-emerald-50'} ref={panelContainer}>
              <PanelToggle panelWidth={panelWidth} setPanelWidth={setPanelWidth} />
              <h1 className={panelWidth == 'w-12' ? 'hidden' : 'visible' }>Content Panel</h1>
            </section>
        </div>
        <div className="h-full w-full absolute z-10">
            <MapDisplay panelOffset={panelOffset}/>
        </div>
      </main>
    </>
  )
}
