"use client"
import React, { useRef, useEffect, useState, useContext } from 'react'
import { useRouter } from 'next/navigation'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import MapFilter from './MapFilter'
import { ActiveFeatureContext } from '@/app/providers'
import { hslToString, hexToHSL } from '@/utils/hexToHSL'
import { MapContext } from '@/app/providers'
import { panelClassNames } from '@/app/providers'


export default function MapDisplay(props) {

    const mapContainer = useRef(null)
    const {map} = useContext(MapContext)

    const router = useRouter()

    const {activeFeature} = useContext(ActiveFeatureContext)
    const {setActiveFeature} = useContext(ActiveFeatureContext)

    const [activeThemes, setActiveThemes] = useState(props.themes)

    /* Tags are passed down the component tree as both a nested object (props.tagLists) which is used for grouping the tags in the UI, and a flat list of tags and their ids which is used for manipulating the filter state, as it's easier to deal with a flat list then an object. 
    
    The other way this could be done (and arguably more elegant) would be to have a single flat list returned from the api which contains a 'group' item for each tag, which you then use to both manage filter state and group in the UI.
    */

    const flatTagList = {}

    Object.keys(props.tagLists).forEach(key => {
        const tagList = props.tagLists[key]
        const tagNames = Object.keys(tagList.tags)
        tagNames.forEach(tagId => {
            flatTagList[tagId] = tagList.tags[tagId]
        })
    })

    const [activeTags, setActiveTags] = useState(flatTagList)

    useEffect(() => {
        if (map.current) return; // stops map from intializing more than once
      
        map.current = new maplibregl.Map({
          container: mapContainer.current,
          style: `https://api.maptiler.com/maps/positron/style.json?key=${props.apiKey}`,
          //style: 'https://api.mapbox.com/styles/v1/chronocarto/clm6h762v00z401nz9kub3p8n?access_token=pk.eyJ1IjoiY2hyb25vY2FydG8iLCJhIjoiY2trbnRnajFvM2xocTJvcGF5czBsdGQ4byJ9.4AKwwY23PdK6ZD5lJUhaYQ',
          center: props.mapCenter,
          zoom: props.mapZoom,
          doubleClickZoom: false
        })

        
      
        map.current.addControl(new maplibregl.NavigationControl(), 'top-right')

    }, [])

    useEffect(() => {
        // Reset the map if the content panel is closed
        if (map.current && map.current.loaded()) {
            if (props.panelSize == panelClassNames.hidden) {
                map.current.flyTo({center: props.mapCenter, zoom: props.mapZoom})
            }
        }
    }, [props.panelSize])

    useEffect(() => {
        // Pan the map to offset the center on the basis of the width of the panel
        if (map.current && map.current.loaded()) {
            if (props.panelOffset) {
                map.current.easeTo({padding: {top: 0, right: 0, bottom: 0, left: props.panelOffset}, duration: 500})
            }
        }   
    }, [props.panelOffset])

    useEffect(() => {
        // Add the data to the map
        if (map.current) {
            map.current.on('load', () => {

                const themeStyles = [
                    'case',
                ]

                const themeStrokeStyles = [
                    'case',
                ]
                
                Object.keys(props.themes).forEach(key => {
                    themeStyles.push(['==', ['to-number', ['get', 'theme_id']], ['to-number', key]], props.themes[key].color)

                    const hslColor = hexToHSL(props.themes[key].color)
                    const hslString = hslToString(hslColor.h, hslColor.s, hslColor.l + 10)

                    themeStrokeStyles.push(['==', ['to-number', ['get', 'theme_id']], ['to-number', key]], hslString)

                })
                
                themeStyles.push('#c1c1c1')
                themeStrokeStyles.push('#c1c1c1')
                
                map.current.addSource('interactive', {
                    'type': 'vector',
                    'url': props.tileJson,
                    'promoteId': 'uuid'
                })
                
                map.current.addLayer({
                    id: 'points',
                    source: 'interactive',
                    'source-layer': 'points',
                    type: 'circle',
                    paint: {
                        'circle-color': themeStyles,
                        'circle-stroke-width': [
                            'case',
                            ['boolean', ['feature-state', 'hover'], false],
                            5,
                            4
                        ],
                        'circle-stroke-color': themeStrokeStyles,
                        'circle-stroke-opacity': [
                            'case',
                            ['boolean', ['feature-state', 'hover'], false],
                            1,
                            0.5
                        ]
                    }
                })

                map.current.addLayer({
                    id: 'points_labels',
                    source: 'interactive',
                    'source-layer': 'points',
                    type: 'symbol',
                    layout: {
                        'text-field': ['get', 'name'],
                        'text-anchor': 'left',
                        'text-size': 10,
                        'text-offset': [1, 0]
                    },
                    paint: {
                        'text-color': 'black',
                        'text-halo-width': 3,
                        'text-halo-color': 'rgba(235,235,235,0.8)'
                    }
                })
                
                // Do stuff when you click on a feature
                map.current.on("click", e => {
                    const features = map.current.queryRenderedFeatures(e.point, {
                      layers: ["points", "points_labels"],
                    })
                  
                    if (features.length > 0) {
                        const uuid = features[0].properties.uuid
                        const slug = features[0].properties.attachments.split(',')[0]
                        setActiveFeature({feature: uuid, slug: slug})
                    }
                })

                map.current.on("touchstart", e => {
                    const features = map.current.queryRenderedFeatures(e.point, {
                      layers: ["points", , "points_labels"],
                    })
                  
                    if (features.length > 0) {
                        const uuid = features[0].properties.uuid
                        const slug = features[0].properties.attachments.split(',')[0]
                        setActiveFeature({feature: uuid, slug: slug})
                    }
                })


                // Change feature style on hover
                let hoverStateId = null

                map.current.on('mousemove', 'points', (e) => {
                    if (e.features.length > 0) {
                        map.current.getCanvas().style.cursor = 'pointer'
                        if (hoverStateId) {
                            map.current.setFeatureState(
                                {
                                    source: 'interactive', 
                                    id: hoverStateId,
                                    sourceLayer: 'points'
                                },
                                {hover: false}
                            )
                        }
                        hoverStateId = e.features[0].id;
                        map.current.setFeatureState(
                            {
                                source: 'interactive', 
                                id: hoverStateId,
                                sourceLayer: 'points'
                            },
                            {hover: true}
                        );
                    }
                })
        
                // When the mouse leaves the state-fill layer, update the feature state of the
                // previously hovered feature.
                map.current.on('mouseleave', 'points', () => {
                    if (hoverStateId) {
                        map.current.getCanvas().style.cursor = ''
                        map.current.setFeatureState(
                            {
                                source: 'interactive',
                                id: hoverStateId,
                                sourceLayer: 'points'
                        },
                            {hover: false}
                        )
                    }
                    hoverStateId = null;
                })

                // Make the pointer change when labels are hovered (for now, don't change the style)
                
                map.current.on('mousemove', 'points_labels', (e) => {
                    if (e.features.length > 0) {
                        map.current.getCanvas().style.cursor = 'pointer'
                    }
                })

                map.current.on('mouseleave', 'points_labels', (e) => {
                    map.current.getCanvas().style.cursor = ''
                })
            })
        }
    }, [map])

    useEffect(() => {
        // If there is an activeFeature, fly to it and load the page
        if (map.current && map.current.loaded() && activeFeature) {
            if (activeFeature.feature) {

                // TODO: coordinates are returned from search; maybe from page loads too? It's neater but'll need a bit of mucking about to work
                if (activeFeature.coordinates) {
                    map.current.flyTo({center: activeFeature.coordinates, zoom: 15})
                    router.push(('/feature/' + activeFeature.feature + '/' + activeFeature.slug))
                    return
                }

                const features = map.current.querySourceFeatures('interactive', {
                    'sourceLayer': 'points',
                    'filter': ['==', ['get', 'uuid'], activeFeature.feature]
                })

                if (features.length > 0) {
                    if (props.panelSize == panelClassNames.hidden) {
                        props.setPanelSize(panelClassNames.medium)
                    }
                    map.current.flyTo({center: features[0].geometry.coordinates, zoom: 15})
                    router.push(('/feature/' + activeFeature.feature + '/' + activeFeature.slug))
                }

            }
        }
    }, [map, activeFeature])

    useEffect(() => {
        // Apply the map filters when they are updated
        if (map.current && map.current.loaded()) {
            // All map filters
            const allFilters = ['all']
            
            // Tags
            // As this is written, any of the flat list of tags can be active, which leads to slightly counter-intuitive results (ie. if something is tagged 'Austrian' and 'Prose', turning off 'Prose' leaves it active if 'Austrian' is still active.) So what needs to happen is each tag group adds a separate ['all'] combo to the allFilters list.

            const tagFilters = ['any']
            Object.keys(activeTags).forEach((key) => {
                if (activeTags[key].active) {
                    const tagFilter = ['in', activeTags[key].name, ['get', 'tag_str']]
                    tagFilters.push(tagFilter)
                }
            })
            allFilters.push(tagFilters)  
            
            // Themes
            const themeIds = Object.keys(activeThemes).map(key => 
                activeThemes[key].active ? parseInt(key) : null
            )
            const themeFilter = ['in', ['get', 'theme_id'], ['literal', themeIds]]
            allFilters.push(themeFilter) 
                        
            map.current.setFilter('points', allFilters)
            map.current.setFilter('points_labels', allFilters)

            // When the filters are updated, updated the list of available tags so the intersection is always visible
            
            /* Disabled for now - stretch goal. May be too complex - how do you get a total list of all available tags? queryRenderedFeatures and querySourceFeatures only give you geojson for the features in the viewport */

            /*
            const availableTags = new Set()

            const features = map.current.queryRenderedFeatures({layers: ['points']})

            features.forEach((f) => {
                const tagList = f.properties.tag_str.split(',')
                tagList.forEach((t) => {
                    availableTags.add(t)
                })
            })

            setAvailableTagList(Array.from(availableTags))
            */
        }
    }, [activeThemes, activeTags])

    return (
        <div className="w-full bg-blue-50 relative h-full">
            <div ref={mapContainer} className="map block absolute w-full h-full" />
            <MapFilter themes={activeThemes} tagLists={props.tagLists} activeTags={activeTags} setActiveThemes={setActiveThemes} setActiveTags={setActiveTags} /*availableTagList={availableTagList}*/ />
        </div>
    )
}