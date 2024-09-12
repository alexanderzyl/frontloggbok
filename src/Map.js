import React, {useEffect, useRef, useState} from 'react';
import mapboxgl from '!mapbox-gl';
import './Map.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import {createNpMarker, createNpPopup, createPoiMarker, createPoiPopup} from "./Markers";
import MapboxGeocoder from "mapbox-gl-geocoder";

mapboxgl.accessToken = 'pk.eyJ1IjoiYXp5bHNvZnQiLCJhIjoiY2x6NzY3a3ExMDYxbjJpczVyZGxzd2R6biJ9.3Co395qaKUdX4xlZieOj5Q';

const Map = ({npInfo, setNpInfo, navPoints, mode, setMode, setCurLocation, curLocation, setCurPoi}) => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const geolocate = useRef(null);
    const markers = useRef([]);
    const [lng, setLng] = useState(12.5);
    const [lat, setLat] =  useState(41.8);
    const [zoom, setZoom] = useState(6);

    const zoomToWeight = {
        1:30,
        2: 30,
        3: 20,
        4:15,
        5: 10,
        6: 5,
        7: 1,
    };

    async function asyncFilter(array, predicate) {
        const results = await Promise.all(array.map(predicate));

        return array.filter((_v, index) => results[index]);
    }

    async function addNpsMarkers() {
        // Clear existing markers
        if(markers.current.length > 0) {
            markers.current.forEach(marker => {
                marker.remove();
            });
            markers.current = [];
        }
        let int_zoom = Math.round(zoom);
        const minWeight = zoomToWeight[int_zoom] !== undefined ? zoomToWeight[int_zoom] : 0;
        // console.log('zoom', int_zoom);

        const filteredNavPoints = await asyncFilter(navPoints, async point => {
            return point.num_pois >= minWeight;
        });

        const pointsAndElements = await Promise.all(filteredNavPoints.map(async point => {
            const el = await createNpMarker(point);
            return { point, el };
        }));

        // Add markers to the map
        pointsAndElements.forEach(({point, el}) => {

            const marker = new mapboxgl.Marker(el)
                .setLngLat([point.longitude, point.latitude])
                // .setPopup(popup)
                .addTo(map.current);

            const backendUrl = process.env.REACT_APP_BACKEND_URL;

            marker.getElement().addEventListener('click', () => {
                fetch(`${backendUrl}/navpoint/${point.id}`)
                    .then(response => response.json())
                    .then(np_data => {
                        setNpInfo(np_data);
                        // setCurLocation({latitude: np_data.latitude, longitude: np_data.longitude});
                        setMode('poisState');
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
            });
            markers.current.push(marker);
        });
    }

    async function addPoisMarkers() {
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
            const pointsAndElements = await Promise.all(pois.map(async point => {
                const el = await createPoiMarker(point);
                return { point, el };
            }));
            pointsAndElements.forEach(({point,el}) => {
                const popup = new mapboxgl.Popup({offset: 25});
                // const div_marker = createPoiPopup(point);
                const marker = new mapboxgl.Marker(el)
                    .setLngLat([point.longitude, point.latitude])
                    // .setPopup(popup.setHTML(div_marker.outerHTML))
                    .addTo(map.current);
                marker.getElement().addEventListener('click', () => {
                    setCurPoi(point);
                });
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

        geolocate.current = new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            trackUserLocation: false,
            showUserHeading: false
        });

        geolocate.current.on('geolocate', function(e) {
            // console.log('geolocate e', e);
            setCurLocation({latitude: e.coords.latitude, longitude: e.coords.longitude});
        });
        map.current.addControl(geolocate.current);

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

        // immediately trigger geolocation on map load
        // map.current.on('load', function() {
        //     geolocate.current.trigger();
        // });
    }, []);

    useEffect(() => {

        if (!map.current || !navPoints || navPoints.length === 0) {
            return;
        }
        addNpsMarkers().then(r => console.log('done'));
    }, [navPoints]);

    useEffect(() => {
        if(mode === 'poisState') {
            map.current.flyTo({
                center: [npInfo.longitude, npInfo.latitude],
                essential: true,
                zoom: 15
            });
            setZoom(15);
            addPoisMarkers().then(r => console.log('done'));

        }
        else if(mode === 'npsState') {
            if(npInfo && Object.keys(npInfo).length > 0) {
                map.current.flyTo({
                    center: [npInfo.longitude, npInfo.latitude],
                    essential: true,
                    zoom: 9
                });
                setZoom(9);
            }
            addNpsMarkers().then(r => console.log('done'));
        }
    }, [mode]);

    useEffect(() => {
        if(zoom <= 9) {
            if (mode==='npsState') {
                addNpsMarkers().then(r => console.log('done'));
            }
            setMode('npsState');
        }
    }, [zoom]);
    // useEffect(() => {
    //     if (npDetailsState === 'trip') {
    //         geolocate.current.trigger();
    //     }
    //
    // }, [npDetailsState]);

    useEffect(() => {
        if (curLocation && Object.keys(curLocation).length > 0) {
            map.current.flyTo({
                center: [curLocation.longitude, curLocation.latitude],
                essential: true,
                zoom: zoom
            });
        }

    }, [curLocation]);

    return (
        <div>
            <div ref={mapContainer} className="map-container" />
        </div>
    );
};

export default Map;
