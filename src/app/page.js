"use client"
import { useState, useRef, useEffect, createContext } from 'react'
import MapDisplay from '@/components/map/MapDisplay'
import PanelToggle from '@/components/buttons/PanelToggle'
import useSiteConfig from '@/apicalls/UseSiteConfig'
import ContentPanel from '@/components/content/ContentPanel'
import Container from '@/components/content/Container'

export const PanelWidthContext = createContext(null)

export default function Home() {

  const [panelWidth, setPanelWidth] = useState('w-1/3')

  return (
    <PanelWidthContext.Provider value={{panelWidth, setPanelWidth}}>
      <Container>
        <ContentPanel panelWidth={panelWidth} />
      </Container>
    </PanelWidthContext.Provider>
  )
}
