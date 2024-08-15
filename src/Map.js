import React, {useEffect, useRef, useState} from 'react';
import mapboxgl from '!mapbox-gl';
import './Map.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import {createImageMarker} from "./Markers";

mapboxgl.accessToken = 'pk.eyJ1IjoiYXp5bHNvZnQiLCJhIjoiY2x6NzY3a3ExMDYxbjJpczVyZGxzd2R6biJ9.3Co395qaKUdX4xlZieOj5Q';

const Map = ({selectedImage}) => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const marker = useRef(null);
    const [lng, setLng] = useState(-70.9);
    const [lat, setLat] = useState(42.35);
    const [zoom, setZoom] = useState(9);

    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [lng, lat],
            zoom: zoom
        });

        marker.current = new mapboxgl.Marker()
            .setLngLat([lng, lat])
            .addTo(map.current);
    }, []);

    useEffect(() => {
        if (!map.current || !selectedImage || typeof selectedImage !== 'object' || selectedImage.longitude === undefined || selectedImage.latitude === undefined) {
            return;
        }
        // console.log(selectedImage);
        map.current.flyTo({
            center: [selectedImage.longitude, selectedImage.latitude],
            essential: true // this animation is considered essential with respect to prefers-reduced-motion
        });
        if (marker.current) {
            marker.current.remove(); // remove existing marker
        }

        // create a DOM element and set its properties
        const div_marker = createImageMarker(selectedImage);

        marker.current = new mapboxgl.Marker(div_marker)
            .setLngLat([selectedImage.longitude, selectedImage.latitude])
            .addTo(map.current);
    }, [selectedImage]);

    return (
        <div>
            <div ref={mapContainer} className="map-container" />
        </div>
    );
};

export default Map;
