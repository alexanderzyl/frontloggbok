import React, {useEffect, useRef, useState} from 'react';
import mapboxgl from '!mapbox-gl';
import './Map.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import {createNpMarker, createNpPopup, createPoiPopup} from "./Markers";
import MapboxGeocoder from "mapbox-gl-geocoder";

mapboxgl.accessToken = 'pk.eyJ1IjoiYXp5bHNvZnQiLCJhIjoiY2x6NzY3a3ExMDYxbjJpczVyZGxzd2R6biJ9.3Co395qaKUdX4xlZieOj5Q';

const Map = ({npInfo, setNpInfo, navPoints, mode, setMode}) => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const markers = useRef([]);
    const [lng, setLng] = useState(-70.9);
    const [lat, setLat] = useState(42.35);
    const [zoom, setZoom] = useState(9);

    function addNpsMarkers() {
        // Clear existing markers
        if(markers.current.length > 0) {
            markers.current.forEach(marker => {
                marker.remove();
            });
            markers.current = [];
        }
        // Add markers to the map
        navPoints.forEach(point => {
            const popup = new mapboxgl.Popup({offset: 25});

            popup.on('open', () => {
                fetch(`https://backlogbok.onrender.com/api/v1/navpoint/${point.id}`)
                    .then(response => response.json())
                    .then(np_data => {
                        const div_marker = createNpPopup(np_data);
                        popup.setHTML(div_marker.outerHTML);
                        console.log(np_data);
                        setNpInfo(np_data);
                        setMode('poisState');
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        popup.setHTML('<div>Error loading data</div>');
                    });
            });

            // const el_marker = createNpMarker();

            const el = createNpMarker()

            const marker = new mapboxgl.Marker(el)
                .setLngLat([point.longitude, point.latitude])
                .setPopup(popup)
                .addTo(map.current);
            markers.current.push(marker);
        });
    }

    function addPoisMarkers() {
        // Clear existing markers
        if(markers.current.length > 0) {
            markers.current.forEach(marker => {
                marker.remove();
            });
            markers.current = [];
        }
        if (npInfo && Object.keys(npInfo).length > 0) {
            // Add markers to the map
            const pois = npInfo.pois;
            pois.forEach(point => {
                const popup = new mapboxgl.Popup({offset: 25});
                const div_marker = createPoiPopup(point);
                const marker = new mapboxgl.Marker()
                    .setLngLat([point.longitude, point.latitude])
                    .setPopup(popup.setHTML(div_marker.outerHTML))
                    .addTo(map.current);
                markers.current.push(marker);
            });
        }
    }

    function createNpButton() {
        return  {
            onAdd: function (map) {
                const div = document.createElement('div');
                div.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';

                const button = document.createElement('button');
                button.className = 'mapboxgl-ctrl-icon custom-zoom-button';
                button.type = 'button';
                button.innerText = 'See Cities';
                button['aria-label'] = 'Zoom to specific level';
                button.onclick = function(){
                    setMode('npsState');
                };
                div.appendChild(button);

                return div;
            }
        };
    }

    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [lng, lat],
            zoom: zoom
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

        map.current.on('zoom', function () {
            const newZoom = map.current.getZoom();
            if(newZoom !== zoom) {
                setZoom(map.current.getZoom());
            }
        });

        const buttonZoomControl = createNpButton();

        map.current.addControl(buttonZoomControl, 'top-left');
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
        addNpsMarkers();
    }, [navPoints]);

    useEffect(() => {
        if(mode === 'poisState') {
            map.current.flyTo({
                center: [npInfo.longitude, npInfo.latitude],
                essential: true,
                zoom: 13
            });
            addPoisMarkers();

        }
        else if(mode === 'npsState') {
            if(npInfo && Object.keys(npInfo).length > 0) {
                map.current.flyTo({
                    center: [npInfo.longitude, npInfo.latitude],
                    essential: true,
                    zoom: 9
                });
            }
            addNpsMarkers();
        }
    }, [mode]);

    useEffect(() => {
        if(zoom <= 9) {
            setMode('npsState');
        }
    }, [zoom]);

    return (
        <div>
            <div ref={mapContainer} className="map-container" />
        </div>
    );
};

export default Map;
