import React, {useEffect, useRef, useState} from 'react';
import mapboxgl from '!mapbox-gl';
import './Map.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import {createImageMarker} from "./Markers";
import MapboxGeocoder from "mapbox-gl-geocoder";

mapboxgl.accessToken = 'pk.eyJ1IjoiYXp5bHNvZnQiLCJhIjoiY2x6NzY3a3ExMDYxbjJpczVyZGxzd2R6biJ9.3Co395qaKUdX4xlZieOj5Q';

const Map = ({selectedNp, npInfo, navPoints}) => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const marker = useRef(null);
    const [lng, setLng] = useState(-70.9);
    const [lat, setLat] = useState(42.35);

    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [lng, lat],
            zoom: 9
        });

        const geocoder = new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            mapboxgl: mapboxgl,
        });

        map.current.addControl(geocoder);

        geocoder.on('result', function (e) {
            map.current.flyTo({
                center: e.result.center,
                essential: true,
                zoom: 12
            });});

        marker.current = new mapboxgl.Marker()
            .setLngLat([lng, lat])
            .addTo(map.current);
    }, []);

    useEffect(() => {
        if (!map.current || !navPoints || navPoints.length === 0) {
            return;
        }
        let somePoint = navPoints[Math.floor(Math.random() * navPoints.length)];
        map.current.flyTo({
            center: [somePoint.longitude, somePoint.latitude],
            essential: true
        })
        // Add markers to the map
        navPoints.forEach(point => {
            new mapboxgl.Marker()
                .setLngLat([point.longitude, point.latitude])
                .addTo(map.current);
        });
    }, [navPoints]);

    useEffect(() => {
        if (!map.current || !selectedNp || typeof selectedNp !== 'object' || selectedNp.longitude === undefined || selectedNp.latitude === undefined) {
            return;
        }
        // console.log(selectedImage);
        map.current.flyTo({
            center: [selectedNp.longitude, selectedNp.latitude],
            essential: true
        });
        if (marker.current) {
            marker.current = new mapboxgl.Marker()
                .setLngLat([selectedNp.longitude, selectedNp.latitude])
                .addTo(map.current); // remove existing marker
        }

        // create a DOM element and set its properties
        const div_marker = createImageMarker(selectedNp, npInfo);

        marker.current = new mapboxgl.Marker(div_marker)
            .setLngLat([selectedNp.longitude, selectedNp.latitude])
            .addTo(map.current);
    }, [npInfo]);

    return (
        <div>
            <div ref={mapContainer} className="map-container" />
        </div>
    );
};

export default Map;
