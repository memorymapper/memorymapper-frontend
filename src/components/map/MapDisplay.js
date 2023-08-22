"use client"
import React, { useRef, useEffect, useState, useContext } from 'react'
import { useRouter } from 'next/navigation'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import MapFilter from './MapFilter'
import { ActiveFeature } from '@/app/(map)/layout'
import { hslToString, hexToHSL } from '@/utils/hexToHSL'

export default function MapDisplay(props) {

    const mapContainer = useRef(null)
    const map = useRef(null)

    const router = useRouter()

    const {activeFeature} = useContext(ActiveFeature)
    const {setActiveFeature} = useContext(ActiveFeature)

    const [activeThemes, setActiveThemes] = useState(props.themes)

    /* Tags are passed down the component tree as both a nested object (props.tagLists) which is used for grouping the tags in the UI, and a flat list of tags and their ids which is used for manipulating the filter state, as it's easier to deal with a flat list then an object. 
    
    The other way this could be done (and arguably more elegant) would be to have a single flat list returned from the api which contains a 'group' item for each tag, which you then use to both manage filter state and group in the UI.
    */

    const flatTagList = {}

    Object.keys(props.tagLists).forEach(key => {
        Object.keys(props.tagLists[key].tags).forEach(tagId => {
            flatTagList[tagId] = props.tagLists[key].tags[tagId]
        })
    })

    const [activeTags, setActiveTags] = useState(flatTagList)

    /*const [availableTagList, setAvailableTagList] = useState(Object.keys(flatTagList).map(tag => flatTagList[tag].name))*/

    useEffect(() => {
        if (map.current) return; // stops map from intializing more than once
      
        map.current = new maplibregl.Map({
          container: mapContainer.current,
          style: `https://api.maptiler.com/maps/dataviz/style.json?key=${props.apiKey}`,
          center: props.mapCenter,
          zoom: props.mapZoom
        })
      
        map.current.addControl(new maplibregl.NavigationControl(), 'top-right')

    }, [])

    useEffect(() => {
        // Pan the map to offset the center on the basis of the width of the panel
        if (map.current) {
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
                        'text-halo-width': 3,
                        'text-halo-color': 'rgba(255,255,255,0.8)'
                    }
                })
                
                // Do stuff when you click on a feature
                map.current.on("click", e => {
                    const features = map.current.queryRenderedFeatures(e.point, {
                      layers: ["points"],
                    })
                  
                    if (features.length > 0) {
                        const uuid = features[0].properties.uuid
                        setActiveFeature(uuid)
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
                            );
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
                        );
                    }
                    hoverStateId = null;
                })

            })
        }
    }, [map])

    useEffect(() => {
        if (map.current && map.current.loaded() && activeFeature) {
            if (activeFeature) {
                const features = map.current.querySourceFeatures('interactive', {
                    'sourceLayer': 'points',
                    'filter': ['==', ['get', 'uuid'], activeFeature]
                })
                if (features.length > 0) {
                    map.current.flyTo({center: features[0].geometry.coordinates, zoom: 15})
                    const uuid = features[0].properties.uuid
                    const slug = features[0].properties.slug
                    router.push(('/feature/' + uuid + '/' + slug))
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