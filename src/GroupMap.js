import React, {useEffect, useRef, useState} from 'react';
import mapboxgl from '!mapbox-gl';
import './Map.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxGeocoder from "mapbox-gl-geocoder";
import {createPoiMarker} from "./Markers";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const GroupMap = ({curLocation,setCurLocation, groupData}) => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const geolocate = useRef(null);
    const initLat = 12.5;
    const initLon=  41.8;
    const markers = useRef([]);

    async function addMarkers() {
        // Clear existing markers
        if(markers.current.length > 0) {
            markers.current.forEach(marker => {
                marker.remove();
            });
            markers.current = [];
        }
        if (groupData && Object.keys(groupData).length > 0) {
            // Add markers to the map
            const pois = groupData.pois;
            const psels = await Promise.all(pois.map(async point => {
                const el = await createPoiMarker(point);
                return { point, el };
            }));
            psels.forEach(({point,el}) => {
                const marker = new mapboxgl.Marker(el)
                    .setLngLat([point.longitude, point.latitude])
                    .addTo(map.current);
                marker.getElement().addEventListener('click', () => {
                    setCurLocation(point);
                });
                markers.current.push(marker);
            });
        }
    }

    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [initLat, initLon],
            zoom: 6
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
            setCurLocation({latitude: e.coords.latitude, longitude: e.coords.longitude});
        });
        map.current.addControl(geolocate.current);

        geocoder.on('result', function (e) {
            map.current.flyTo({
                center: e.result.center,
                essential: true,
                zoom: 12
            });});

    }, []);

    useEffect(() => {
        if (curLocation && Object.keys(curLocation).length > 0) {
            const zoom = map.current.getZoom();
            map.current.flyTo({
                center: [curLocation.longitude, curLocation.latitude],
                essential: true,
                zoom: zoom
            });
        }

    }, [curLocation]);

    useEffect(() => {
        if (groupData && Object.keys(groupData).length > 0) {
            map.current.flyTo({
                center: [groupData.longitude, groupData.latitude],
                essential: true,
                zoom: 12
            });
            addMarkers().then();
        }
    }, [groupData]);

    return (
        <div>
            <div ref={mapContainer} className="map-container" />
        </div>
    );

}

export default GroupMap;