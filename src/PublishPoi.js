import React, {useEffect, useRef, useState} from 'react';
import { useParams } from 'react-router-dom';
import axios from "axios";
import mapboxgl from "!mapbox-gl";
import './Map.css';
import {createPoiMarker} from "./Markers";
import {createRoot} from "react-dom/client";
import PoiPopup from "./PoiPopup";


mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const createUserPoiPopup = (point) => {
    const popupContainer = document.createElement('div');
    const root = createRoot(popupContainer);
    root.render(<PoiPopup point={point} />);
    return new mapboxgl.Popup().setDOMContent(popupContainer);
};

const PublishPoi = () => {
    const { shortId } = useParams();
    const [poiData, setPoiData] = useState(null);
    const mapContainer = useRef(null);
    const map = useRef(null);

    const [lng, setLng] = useState(12.5);
    const [lat, setLat] =  useState(41.8);
    const [zoom, setZoom] = useState(6);

    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    // Initialize mapbox
    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [lng, lat],
            zoom: zoom
        });

        map.current.on('zoom', function () {
            const newZoom = map.current.getZoom();
            if(newZoom !== zoom) {
                setZoom(map.current.getZoom());
            }
        });
    }, []);


    useEffect(() => {
        const fetchData = async (shortId) => {
            try {
                const headers = {
                    'Content-Type': 'application/json'
                }
                const res = await axios.get(`${backendUrl}/poi/${shortId}`, { headers });
                // console.log('POI Data:', res.data);
                setPoiData(res.data);
            } catch (err) {
                console.error('Failed to fetch user pois', err);
            }
        };
        fetchData(shortId).then();
    }, [shortId]);

    useEffect(() => {
        const fetchData = async () => {
            if (!poiData) return;
            // console.log('POI Data:', poiData);
            if (map.current) {
                setLat(poiData.latitude);
                setLng(poiData.longitude);
                setZoom(15);
                map.current.flyTo({
                    center: [poiData.longitude, poiData.latitude],
                    zoom: 15
                });
                const marker_el  = await createPoiMarker(poiData);
                const popup = createUserPoiPopup(poiData);

                return new mapboxgl.Marker(marker_el)
                    .setLngLat([poiData.longitude, poiData.latitude])
                    .setPopup(popup)
                    .addTo(map.current);
            }
        }
        fetchData().then();
    }, [poiData]);

    return (
        <div>
            <div ref={mapContainer} className="map-container" />
        </div>
    );
};

export default PublishPoi;