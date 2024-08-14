import React, {useEffect, useRef, useState} from 'react';
import mapboxgl from '!mapbox-gl';
import './Map.css';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiYXp5bHNvZnQiLCJhIjoiY2x6NzY3a3ExMDYxbjJpczVyZGxzd2R6biJ9.3Co395qaKUdX4xlZieOj5Q';

function openNavigation(latitude, longitude) {
    let isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    let url = '';

    if (isIOS) {
        url = `maps://?saddr=&daddr=${latitude},${longitude}`;
    } else { // Android and others
        url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    }

    window.open(url, '_blank');
}
const Map = ({coordinates, selectedImage}) => {
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

    // useEffect(() => {
    //     if(!map.current || !coordinates || coordinates.length === 0) {
    //         return;
    //     }
    //     map.current.flyTo({
    //         center: coordinates[0],
    //         essential: true // this animation is considered essential with respect to prefers-reduced-motion
    //     });
    //
    //     if(marker.current) {
    //         marker.current.remove(); // remove existing marker
    //     }
    //
    //     marker.current = new mapboxgl.Marker()
    //         .setLngLat([coordinates[0][0], coordinates[0][1]])
    //         .addTo(map.current);
    // }, [coordinates]);

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
        const div_marker = document.createElement('div');

        const div_image = document.createElement('div');
        div_image.className = 'marker';
        div_image.style.backgroundImage = `url(${selectedImage.url})`;
        div_marker.appendChild(div_image);

        // Create a navigate button
        const navigateButton = document.createElement('button');
        navigateButton.className = 'navigate-button';
        navigateButton.innerHTML = 'Navigate';
        navigateButton.onclick = function() {
            openNavigation(selectedImage.latitude, selectedImage.longitude);
        };
        div_marker.appendChild(navigateButton);

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
