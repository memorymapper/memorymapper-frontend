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

    const [isReset, setIsReset] = useState(false)

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

    const layerList = []

    props.mapLayers
        ? props.mapLayers.forEach(l => {
            l.visibility = 'visible'
            layerList.push(l)
        })
        : null

    const [activeLayers, setActiveLayers] = useState(layerList)

    useEffect(() => {
        if (map.current) return; // stops map from intializing more than once
      
        map.current = new maplibregl.Map({
          container: mapContainer.current,
          style: `https://api.maptiler.com/maps/positron/style.json?key=${props.apiKey}`,
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
                
                // Load any additional raster layers, if present
                props.mapLayers ? activeLayers.forEach(l => {    
                    if (! map.current.getSource(l.slug)) {
                        map.current.addSource(l.slug, {
                            'type': 'raster',
                            'url': l.tilejson_url,
                            'tileSize': 256
                        })
                        map.current.addLayer({
                            'id': l.slug,
                            'type': 'raster',
                            'source': l.slug,
                            'visibility': l.visibility
                        })
                    }
                }) : null

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

                if (! map.current.getSource('interactive')) {
                    map.current.addSource('interactive', {
                        'type': 'vector',
                        'url': props.tileJson,
                        'promoteId': 'uuid'
                    })
                }
                
                if (! map.current.getLayer('points')) {

                    map.current.addLayer({
                        id: 'points',
                        source: 'interactive',
                        'source-layer': 'points',
                        type: 'circle',
                        paint: {
                            'circle-color': themeStyles,
                            'circle-stroke-width': [
                                'case',
                                ['boolean', ['feature-state', 'hover'], ['feature-state', 'active'], false],
                                5,
                                4
                            ],
                            'circle-stroke-color': themeStrokeStyles,
                            'circle-stroke-opacity': [
                                'case',
                                ['boolean', ['feature-state', 'hover'], ['feature-state', 'active'], false],
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
                            'text-size': 12,
                            'text-offset': [1, 0]
                        },
                        paint: {
                            'text-color': 'black',
                            'text-halo-width': 3,
                            'text-halo-color': 'rgba(235,235,235,0.8)'
                        }
                    })
                }

                if (! map.current.getLayer('polygons')) {
                    map.current.addLayer({
                        id: 'polygons',
                        source: 'interactive',
                        'source-layer': 'polygons',
                        type: 'fill',
                        paint: {
                            'fill-color': themeStyles,
                            'fill-opacity': [
                                'case',
                                ['boolean', ['feature-state', 'hover'], ['feature-state', 'active'], false],
                                1,
                                0.5
                            ]
                        }
                    })

                    map.current.addLayer({
                        id: 'polygons_labels',
                        source: 'interactive',
                        'source-layer': 'polygons',
                        type: 'symbol',
                        layout: {
                            'text-field': ['get', 'name'],
                            'text-anchor': 'center',
                            'text-size': 12,
                        },
                        paint: {
                            'text-color': 'black',
                            'text-halo-width': 1,
                            'text-halo-color': 'rgba(235,235,235,0.8)'
                        }
                    })
                }

                if (! map.current.getLayer('lines')) {
                    map.current.addLayer({
                        id: 'lines',
                        source: 'interactive',
                        'source-layer': 'lines',
                        type: 'line',
                        paint: {
                            'line-color': themeStyles,
                            'line-width': [
                                'case',
                                ['boolean', ['feature-state', 'hover'], ['feature-state', 'active'], false],
                                6,
                                5
                            ],
                            'line-opacity': [
                                'case',
                                ['boolean', ['feature-state', 'hover'], ['feature-state', 'active'], false],
                                1,
                                0.5
                            ]
                        }
                    })

                    map.current.addLayer({
                        id: 'lines_labels',
                        source: 'interactive',
                        'source-layer': 'lines',
                        type: 'symbol',
                        layout: {
                            'text-field': ['get', 'name'],
                            'text-anchor': 'left',
                            'text-size': 12,
                            'symbol-placement': 'line'
                        },
                        paint: {
                            'text-color': 'black',
                            'text-halo-width': 1,
                            'text-halo-color': 'rgba(235,235,235,0.8)'
                        }
                    })
                }

                // Do stuff when you click on a feature
                map.current.on("click", e => {
                    
                    // Because this useEffect loads with the map, activeFeature isn't populated yet, so you can't toggle the highlight. TODO: it'll do for noo, but sort out a workaround.

                    /*if (activeFeature) {
                        console.log('fired')
                        for (const l in contentLayers) {
                            map.current.setFeatureState(
                                {
                                    source: 'interactive',
                                    id: activeFeature.uuid,
                                    sourceLayer: l

                                },
                                {active: false}
                            )
                        }
                    }*/

                    const features = map.current.queryRenderedFeatures(e.point, {
                      layers: ["points", "points_labels", "polygons", "lines", "lines_labels"],
                    })

                    if (features.length > 0) {
                        const uuid = features[0].properties.uuid
                        const slug = features[0].properties.attachments.split(',')[0]
                        setActiveFeature({feature: uuid, slug: slug})
                    }
                })

                map.current.on("touchstart", e => {
                    const features = map.current.queryRenderedFeatures(e.point, {
                      layers: ["points", "points_labels", "polygons", "lines", "lines_labels"],
                    })
                  
                    if (features.length > 0) {
                        const uuid = features[0].properties.uuid
                        const slug = features[0].properties.attachments.split(',')[0]
                        setActiveFeature({feature: uuid, slug: slug})
                    }
                })


                // Change feature style on hover. Has to be duplicated across the three map layer types, which isn't very DRY
                let pointHoverStateId = null

                map.current.on('mouseenter', 'points', (e) => {
                    if (e.features.length > 0) {
                        map.current.getCanvas().style.cursor = 'pointer'
                        if (pointHoverStateId) {
                            map.current.setFeatureState(
                                {
                                    source: 'interactive', 
                                    id: pointHoverStateId,
                                    sourceLayer: 'points'
                                },
                                {hover: false}
                            )
                        }
                        pointHoverStateId = e.features[0].id;
                        map.current.setFeatureState(
                            {
                                source: 'interactive', 
                                id: pointHoverStateId,
                                sourceLayer: 'points'
                            },
                            {hover: true}
                        );
                    }
                })
        
                // When the mouse leaves the points layer, update the feature state of the
                // previously hovered feature.
                map.current.on('mouseleave', 'points', () => {
                    if (pointHoverStateId) {
                        map.current.getCanvas().style.cursor = ''
                        map.current.setFeatureState(
                            {
                                source: 'interactive',
                                id: pointHoverStateId,
                                sourceLayer: 'points'
                        },
                            {hover: false}
                        )
                    }
                    pointHoverStateId = null;
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


                // Polygons

                let polygonHoverStateId = null

                map.current.on('mouseenter', 'polygons', (e) => {
                    if (e.features.length > 0) {
                        map.current.getCanvas().style.cursor = 'pointer'
                        if (polygonHoverStateId) {
                            map.current.setFeatureState(
                                {
                                    source: 'interactive', 
                                    id: polygonHoverStateId,
                                    sourceLayer: 'polygons'
                                },
                                {hover: false}
                            )
                        }
                        polygonHoverStateId = e.features[0].id;
                        map.current.setFeatureState(
                            {
                                source: 'interactive', 
                                id: polygonHoverStateId,
                                sourceLayer: 'polygons'
                            },
                            {hover: true}
                        );
                    }
                })
        
                // When the mouse leaves the polygons layer, update the feature state of the
                // previously hovered feature.
                map.current.on('mouseleave', 'polygons', () => {
                    if (polygonHoverStateId) {
                        map.current.getCanvas().style.cursor = ''
                        map.current.setFeatureState(
                            {
                                source: 'interactive',
                                id: polygonHoverStateId,
                                sourceLayer: 'polygons'
                        },
                            {hover: false}
                        )
                    }
                    polygonHoverStateId = null;
                })

                // Lines

                let lineHoverStateId = null

                map.current.on('mouseenter', 'lines', (e) => {
                    if (e.features.length > 0) {
                        map.current.getCanvas().style.cursor = 'pointer'
                        if (lineHoverStateId) {
                            map.current.setFeatureState(
                                {
                                    source: 'interactive', 
                                    id: lineHoverStateId,
                                    sourceLayer: 'lines'
                                },
                                {hover: false}
                            )
                        }
                        lineHoverStateId = e.features[0].id;
                        map.current.setFeatureState(
                            {
                                source: 'interactive', 
                                id: lineHoverStateId,
                                sourceLayer: 'lines'
                            },
                            {hover: true}
                        );
                    }
                })
        
                // When the mouse leaves the lines layer, update the feature state of the
                // previously hovered feature.
                map.current.on('mouseleave', 'lines', () => {
                    if (lineHoverStateId) {
                        map.current.getCanvas().style.cursor = ''
                        map.current.setFeatureState(
                            {
                                source: 'interactive',
                                id: lineHoverStateId,
                                sourceLayer: 'lines'
                        },
                            {hover: false}
                        )
                    }
                    lineHoverStateId = null;
                })


            })
        }
    }, [map, activeFeature, activeLayers])


    useEffect(() => {
        if (map.current && map.current.loaded() && activeLayers) {
            activeLayers.forEach(l => {
                map.current.setLayoutProperty(l.slug, 'visibility', l.visibility)
            })
        }        
    }, [map, activeLayers])

    useEffect(() => {
        /* 
        Load the content and zoom to the feature. How this works:

        When the user clicks on a map feature, visits a site from an external link, or searches for a site, the 'activeFeature' state is updated to include the UUID of the feature and the slug of the first piece of content. The UI reacts to this state change, finds the feature on the map, zooms to it, and triggers a re-render of the content panel to show the relevant content.

        This may seem backwards: why not just update the content on click, directly? The UUID and slug are there in the data after all? The reason is because the user can arrive at a feature from links and search as well as the map, and it is DRY to have a single set of logic to handle these different cases.

        */
            
        // If there is an activeFeature, fly to it and load the page
        if (map.current && map.current.loaded() && activeFeature) {
            if (activeFeature.feature) {

                // TODO: coordinates are returned from search interface; maybe from page loads too? It's neater but'll need a bit of mucking about to work

                // If the feature returned from anywhere other than the map is a point, indicated by the fact that the first element is a number...
                if (activeFeature.coordinates) {
                    if (! isNaN(activeFeature.coordinates[0])) {
                        map.current.flyTo({center: activeFeature.coordinates, zoom: 18})
                        router.push(('/feature/' + activeFeature.feature + '/' + activeFeature.slug))
                        return
                    }
                }

                // If the feature is a line or a polygon (indcated by the first element of the coordinates array being itself an array, and therefore not a number)...
                if (activeFeature.coordinates) {
                    if (isNaN(activeFeature.coordinates[0])) {

                        let coordinates = null

                        // If there's more than one set of coordinates, it's a line. Unless it's a multipolygon. But first things first...
                        if (activeFeature.coordinates[0].length > 1) {
                            coordinates = activeFeature.coordinates[0]
                        } else {
                            coordinates = activeFeature.coordinates[0][0]
                        }

                        const bounds = coordinates.reduce((bounds, coord) => {
                            return bounds.extend(coord);
                        }, new maplibregl.LngLatBounds(coordinates[0], coordinates[0]))
    
                        map.current.fitBounds(bounds, {padding: {top: 50, right: 100, bottom: 50, left: props.panelOffset }})
                        router.push(('/feature/' + activeFeature.feature + '/' + activeFeature.slug))
                        map.current.setFeatureState(
                            {
                                source: 'interactive', 
                                id: activeFeature.feature,
                                sourceLayer: 'polygons'
                            },
                            {active: true}
                        )
                        return
                    }
                }

                // If you don't have the coordinates needed, find where to zoom to from the activeFeature uuid
                const points = map.current.querySourceFeatures('interactive', {
                    'sourceLayer': 'points',
                    'filter': ['==', ['get', 'uuid'], activeFeature.feature]
                })

                const polygons = map.current.querySourceFeatures('interactive', {
                    'sourceLayer': 'polygons',
                    'filter': ['==', ['get', 'uuid'], activeFeature.feature]
                })

                const lines = map.current.querySourceFeatures('interactive', {
                    'sourceLayer': 'lines',
                    'filter': ['==', ['get', 'uuid'], activeFeature.feature]
                })

                if (points.length > 0) {
                    if (props.panelSize == panelClassNames.hidden) {
                        props.setPanelSize(panelClassNames.medium)
                    }
                    map.current.flyTo({center: points[0].geometry.coordinates, zoom: 18, padding: {top: 0, right: 0, bottom: 0, left: props.panelOffset }})
                    router.push(('/feature/' + activeFeature.feature + '/' + activeFeature.slug))
                    map.current.setFeatureState(
                        {
                            source: 'interactive', 
                            id: activeFeature.feature,
                            sourceLayer: 'points'
                        },
                        {active: true}
                    )
                }

                if (polygons.length > 0) {
                    if (props.panelSize == panelClassNames.hidden) {
                        props.setPanelSize(panelClassNames.medium)
                    }
                    const coordinates = polygons[0].geometry.coordinates[0]
                    
                    const bounds = coordinates.reduce((bounds, coord) => {
                        return bounds.extend(coord);
                    }, new maplibregl.LngLatBounds(coordinates[0], coordinates[0]))

                    map.current.fitBounds(bounds, {padding: {top: 50, right: 100, bottom: 50, left: props.panelOffset }})
                    router.push(('/feature/' + activeFeature.feature + '/' + activeFeature.slug))
                    map.current.setFeatureState(
                        {
                            source: 'interactive', 
                            id: activeFeature.feature,
                            sourceLayer: 'polygons'
                        },
                        {active: true}
                    )
                }

                if (lines.length > 0) {
                    if (props.panelSize == panelClassNames.hidden) {
                        props.setPanelSize(panelClassNames.medium)
                    }
                    const coordinates = lines[0].geometry.coordinates
                    
                    const bounds = coordinates.reduce((bounds, coord) => {
                        return bounds.extend(coord);
                    }, new maplibregl.LngLatBounds(coordinates[0], coordinates[0]))

                    map.current.fitBounds(bounds, {padding: {top: 50, right: 100, bottom: 50, left: props.panelOffset }})
                    router.push(('/feature/' + activeFeature.feature + '/' + activeFeature.slug))
                    map.current.setFeatureState(
                        {
                            source: 'interactive', 
                            id: activeFeature.feature,
                            sourceLayer: 'lines'
                        },
                        {active: true}
                    )
                }

            }
        }
    }, [map, activeFeature, props.apiKey])

    useEffect(() => {
        // Apply the map filters when they are updated
        if (map.current && map.current.loaded()) {

            // If the 'reset' button has been applied, clear all filters...

            if (isReset) {
                map.current.setFilter('points')
                map.current.setFilter('points_labels')
                map.current.setFilter('polygons')
                map.current.setFilter('polygons_labels')
                map.current.setFilter('lines')
                map.current.setFilter('lines_labels')   
            }

            // All map filters
            const allFilters = ['all']
            
            // Tags
            // As this is written, any of the flat list of tags can be active, which leads to slightly counter-intuitive results (ie. if something is tagged 'Austrian' and 'Prose', turning off 'Prose' leaves it active if 'Austrian' is still active.) So what needs to happen is each tag group adds a separate ['all'] combo to the allFilters list.

            // Only filter by tags if a tag is active, otherwise untagged items vanish if you click a theme
            // filter

            let activeTagsCount = 0

            Object.keys(activeTags).forEach((key) => {
                if (activeTags[key].active) {
                    activeTagsCount += 1
                }
            })

            if (activeTagsCount != Object.keys(flatTagList).length) {
                const tagFilters = ['any']
                Object.keys(activeTags).forEach((key) => {
                    if (activeTags[key].active) {
                        const tagFilter = ['in', activeTags[key].name, ['get', 'tag_str']]
                        tagFilters.push(tagFilter)
                    }
                })
                allFilters.push(tagFilters) 
            }
            
            // Themes
            const themeIds = Object.keys(activeThemes).map(key => 
                activeThemes[key].active ? parseInt(key) : null
            )

            const themeFilter = ['in', ['get', 'theme_id'], ['literal', themeIds]]
            allFilters.push(themeFilter) 
                        
            map.current.setFilter('points', allFilters)
            map.current.setFilter('points_labels', allFilters)
            map.current.setFilter('polygons', allFilters)
            map.current.setFilter('polygons_labels', allFilters)
            map.current.setFilter('lines', allFilters)
            map.current.setFilter('lines_labels', allFilters)

            /* Ideally, when the filters are updated, update the list of available tags so the intersection is always visible. Disabled for now - stretch goal. May be too complex - how do you get a total list of all available tags? queryRenderedFeatures and querySourceFeatures only give you geojson for the features in the viewport */

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
            <MapFilter 
                themes={activeThemes} 
                tagLists={props.tagLists} 
                activeTags={activeTags} 
                setActiveThemes={setActiveThemes} 
                setActiveTags={setActiveTags}
                setIsReset={setIsReset}
                mapLayers={activeLayers}
                setActiveLayers={setActiveLayers}
                /*availableTagList={availableTagList}*/ />
        </div>
    )
}