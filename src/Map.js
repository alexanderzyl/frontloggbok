import React, {useEffect, useRef, useState} from 'react';
import mapboxgl from '!mapbox-gl';
import './Map.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import {createImageMarker} from "./Markers";
import MapboxGeocoder from "mapbox-gl-geocoder";

mapboxgl.accessToken = 'pk.eyJ1IjoiYXp5bHNvZnQiLCJhIjoiY2x6NzY3a3ExMDYxbjJpczVyZGxzd2R6biJ9.3Co395qaKUdX4xlZieOj5Q';

const Map = ({npInfo, setNpInfo, navPoints}) => {
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
            const popup = new mapboxgl.Popup({ offset: 25 });

            popup.on('open', () => {
                fetch(`https://backlogbok.onrender.com/api/v1/navpoint/${point.id}`)
                    .then(response => response.json())
                    .then(np_data => {
                        const div_marker = createImageMarker(np_data);
                        popup.setHTML(div_marker.outerHTML);
                        setNpInfo(np_data);
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        popup.setHTML('<div>Error loading data</div>');
                    });
            });

            new mapboxgl.Marker()
                .setLngLat([point.longitude, point.latitude])
                .setPopup(popup)
                .addTo(map.current);
        });
    }, [navPoints]);

    return (
        <div>
            <div ref={mapContainer} className="map-container" />
        </div>
    );
};

export default Map;
