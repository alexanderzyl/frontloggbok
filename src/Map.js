import React, {useEffect, useRef, useState} from 'react';
import mapboxgl from '!mapbox-gl';
import './Map.css';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiYXp5bHNvZnQiLCJhIjoiY2x6NzY3a3ExMDYxbjJpczVyZGxzd2R6biJ9.3Co395qaKUdX4xlZieOj5Q';

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

    useEffect(() => {
        if(!map.current || !coordinates || coordinates.length === 0) {
            return;
        }
        map.current.flyTo({
            center: coordinates[0],
            essential: true // this animation is considered essential with respect to prefers-reduced-motion
        });

        if(marker.current) {
            marker.current.remove(); // remove existing marker
        }

        marker.current = new mapboxgl.Marker()
            .setLngLat([coordinates[0][0], coordinates[0][1]])
            .addTo(map.current);
    }, [coordinates]);

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
        const el = document.createElement('div');
        el.className = 'marker';
        el.style.backgroundImage = `url(${selectedImage.url})`;
        el.style.width = '50px';
        el.style.height = '50px';
        el.style.backgroundSize = 'cover';
        el.style.cursor = 'pointer';

        marker.current = new mapboxgl.Marker(el)
            .setLngLat([selectedImage.longitude, selectedImage.latitude])
            .addTo(map.current);
    }, [selectedImage]);

    return (
        <div>
            <div ref={mapContainer} className="map-container" />
        </div>
    );
}

// const Map = ({coordinates}) => {
//     const mapContainer = useRef(null);
//     const map = useRef(null);
//
//     useEffect(() => {
//         // Only create a new map instance if it does not exist yet
//         if (!map.current) {
//             map.current = new mapboxgl.Map({
//                 container: mapContainer.current,
//                 style: 'mapbox://styles/mapbox/streets-v11',
//                 center: [-74.5, 40],
//                 zoom: 10
//             });
//         }
//
//         map.current.on('style.load', () => {
//             if (coordinates.length > 0) {
//                 map.current.panTo(coordinates[0]);
//             }
//         });
//
//         return () => map.current.remove();
//     }, []); // this effect runs once when component mounts, equivalent to componentDidMount
//
//     // useEffect(() => {
//     //     if (map.current) { // ensure map object exists
//     //         const handleLoad = () => {
//     //             // Following operations now happen after style load
//     //             if (coordinates?.length) {
//     //
//     //                 if (map.current.getSource('markers')) {
//     //                     map.current.removeSource('markers');
//     //                     map.current.removeLayer('markers');
//     //                 }
//     //
//     //                 map.current.addSource('markers', {
//     //                     'type': 'geojson',
//     //                     'data': {
//     //                         'type': 'FeatureCollection',
//     //                         'features': coordinates.map((coord, index) => ({
//     //                             'type': 'Feature',
//     //                             'geometry': {
//     //                                 'type': 'Point',
//     //                                 'coordinates': coord
//     //                             },
//     //                             'properties': {
//     //                                 'id': index
//     //                             }
//     //                         }))
//     //                     }
//     //                 });
//     //
//     //                 map.current.addLayer({
//     //                     'id': 'markers',
//     //                     'type': 'circle',
//     //                     'source': 'markers',
//     //                     'paint': {
//     //                         'circle-radius': 10,
//     //                         'circle-color': '#007cbf'
//     //                     }
//     //                 });
//     //
//     //                 const bounds = coordinates.reduce((bounds, coord) => bounds.extend(coord), new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));
//     //
//     //                 map.current.fitBounds(bounds, { padding: 20 });
//     //             }
//     //         };
//     //
//     //         // Remove existing load listeners if any before adding a new one
//     //         map.current.off('style.load', handleLoad);
//     //         map.current.on('style.load', handleLoad);
//     //     }
//     // }, [coordinates]);
//
//     return <div ref={mapContainer} style={{ height: '400px' }} />;
// };
export default Map;
