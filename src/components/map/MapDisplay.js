"use client"
import React, { useRef, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const mapOptions = {
    zoom: 4,
    style: "https://wms.wheregroup.com/tileserver/style/osm-bright.json",
    center: [7.0851268, 50.73884]
}

export default function MapDisplay(props) {

    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng] = useState(139.753);
    const [lat] = useState(35.6844);
    const [zoom] = useState(14);
    const [API_KEY] = useState('fL9NKV06gTKowpkIEnt4');

    const geojson = {
        'type': 'FeatureCollection',
        'features': [
            {
                'type': 'Feature',
                'geometry': {
                    'type': 'Point',
                    'coordinates': [lng, lat]
                }
            }
        ]
    }

    useEffect(() => {
        if (map.current) return; // stops map from intializing more than once
      
        map.current = new maplibregl.Map({
          container: mapContainer.current,
          style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${API_KEY}`,
          center: [lng, lat],
          zoom: zoom
        })
      
        map.current.addControl(new maplibregl.NavigationControl(), 'top-right')

        new maplibregl.Marker({color: "#FF0000"}).setLngLat([139.7525,35.6846]).addTo(map.current);

    }, [API_KEY, lng, lat, zoom])

    useEffect(() => {
        if (map.current) {
            if (props.panelOffset) {
                map.current.easeTo({padding: {top: 0, right: 0, bottom: 0, left: props.panelOffset}, duration: 500})
            }
        }
    }, [props.panelOffset])

    return (
        <section className="w-full bg-blue-50 relative h-full">
            <div ref={mapContainer} className="map block absolute w-full h-full" />
            <div className="w-1/3 h-20 bg-white absolute bottom-6 right-6"></div>
        </section>
    )
}