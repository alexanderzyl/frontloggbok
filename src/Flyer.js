import React, {useEffect, useRef, useState} from 'react';
import mapboxgl from "!mapbox-gl";
import './Map.css';
import {createPoiMarker} from "./Markers";
import {createRoot} from "react-dom/client";
import PoiPopup from "./PoiPopup";
import {Button, Drawer} from "antd";
import ReactMarkdown from "react-markdown";


mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const createUserPoiPopup = (point) => {
    const popupContainer = document.createElement('div');
    const root = createRoot(popupContainer);
    root.render(<PoiPopup point={point} />);
    return new mapboxgl.Popup().setDOMContent(popupContainer);
};

const Flyer = ({markdown, poi}) => {
    const mapContainer = useRef(null);
    const map = useRef(null);

    const [zoom, setZoom] = useState(15);
    const [openDrawer, setOpenDrawer] = useState(false);

    const showDrawer = () => {
        setOpenDrawer(true);
    }

    const onClose = () => {
        setOpenDrawer(false);
    }

    useEffect(() => {
        if (map.current) return; // initialize map only once
        setZoom(15);
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [12.5, 41.8],
            zoom: zoom
        });
    }, []);

    // Initialize mapbox
    useEffect(() => {
        if (poi !== null && poi !== undefined) {
            map.current.flyTo({
                center: [poi.longitude, poi.latitude],
                zoom: zoom
            });
            createPoiMarker(poi).then(
                (el) => {
                    const popup = createUserPoiPopup(poi);
                    new mapboxgl.Marker(el)
                        .setLngLat([poi.longitude, poi.latitude])
                        .setPopup(popup)
                        .addTo(map.current);
                }
            );
        }
    }, [poi]);

    return (
        <div>
            <Button type="primary" onClick={showDrawer}>
                Open Drawer
            </Button>
            <Drawer
                title="Basic Drawer"
                placement="right"
                onClose={onClose}
                open={openDrawer}
            >
                <ReactMarkdown>{markdown}</ReactMarkdown>
            </Drawer>
            <div ref={mapContainer} className="map-container" />
        </div>
    );
};

export default Flyer;