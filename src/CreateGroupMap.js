import React, {useEffect, useRef, useState} from 'react';
import mapboxgl from '!mapbox-gl';
import './Map.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxGeocoder from "mapbox-gl-geocoder";
import {createRoot} from "react-dom/client";
import AddNewGroupPopup from "./AddNewGroupPopup";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const CreateGroupMap = ({createGroup}) => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const geolocate = useRef(null);
    const initLat = 12.5;
    const initLon=  41.8;
    const createGroupRef = useRef(createGroup);
    const [location, setLocation] = useState({latitude: initLat, longitude: initLon});

    function createNewGroupPopup(lngLat,  createGroup) {
        const popupContainer = document.createElement('div');
        const root = createRoot(popupContainer);
        root.render(<AddNewGroupPopup lat={lngLat.lat} lng={lngLat.lng} createGroup={createGroup} />);
        return new mapboxgl.Popup().setLngLat(lngLat).setDOMContent(popupContainer);
    }

    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [initLat, initLon],
            zoom: 6
        });

        createGroupRef.current = createGroup;

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
            setLocation({latitude: e.coords.latitude, longitude: e.coords.longitude});
        });
        map.current.addControl(geolocate.current);

        geocoder.on('result', function (e) {
            map.current.flyTo({
                center: e.result.center,
                essential: true,
                zoom: 12
            });});

        map.current.on('click', function (e) {
            setLocation({latitude: e.lngLat.lat, longitude: e.lngLat.lng});
            let popup = createNewGroupPopup(e.lngLat, createGroupRef.current);
            popup.addTo(map.current);
        });


    }, []);


    return (
        <div>
            <div ref={mapContainer} className="map-container" />
        </div>
    );

}

export default CreateGroupMap;