import React, {useEffect, useRef} from 'react';
import mapboxgl from '!mapbox-gl';
import './Map.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxGeocoder from "mapbox-gl-geocoder";
import {createRoot} from "react-dom/client";
import AddNewPoiPopup from "./AddNewPoiPopup";
import {createPoiMarker} from "./Markers";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;



const PoiMap = ({pois, curPoiShortId, setCurPoiShortId, curLocation, setCurLocation, poiEditRender, invalidateParent}) => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const geolocate = useRef(null);
    const initLat = 12.5;
    const initLon=  41.8;
    const markers = useRef({});
    const invalidateParentRef = useRef(invalidateParent);

    const createUserPoiPopup = (point) => {
        // Create a container element for the popup content
        const popupContainer = document.createElement('div');

        const popupContent = poiEditRender.renderPoi(point);
        const root = createRoot(popupContainer);
        root.render(popupContent);

        return new mapboxgl.Popup().setDOMContent(popupContainer);
    };

    const createAddNewPoiPopup = (lngLat, feature, handleInvalidate) => {
        const popupContainer = document.createElement('div');
        const root = createRoot(popupContainer);
        root.render(<AddNewPoiPopup lngLat={lngLat} feature={feature} invalidateParent={handleInvalidate} />);
        return new mapboxgl.Popup().setLngLat(lngLat).setDOMContent(popupContainer);
    };

    async function addMarkers() {
        // Clear existing markers
        if (Object.keys(markers.current).length > 0) {
            Object.values(markers.current).forEach(marker => {
                marker.remove();
            });
            markers.current = {};
        }
        if (pois && Object.keys(pois).length > 0) {
            // Add markers to the map
            const psels = await Promise.all(pois.map(async point => {
                const el = await createPoiMarker(point);
                el.classList.add('poi-marker');
                return { point, el };
            }));
            // console.log('Markers:', psels);
            psels.forEach(({point,el}) => {
                const marker = new mapboxgl.Marker(el)
                    .setLngLat([point.longitude, point.latitude])
                    .setPopup(createUserPoiPopup(point))
                    .addTo(map.current);
                const popup = marker.getPopup();
                popup.on('close', () => {
                    if (curPoiShortId === point.short_id) {
                        setCurPoiShortId(null);
                    }});
                marker.getElement().addEventListener('click', () => {
                    setCurLocation(point);
                    if (curPoiShortId !== point.short_id) {
                        setCurPoiShortId(point.short_id);
                    }
                });
                markers.current[point.short_id] = marker;
            });
        }
    }

    useEffect(() => {
        if (map.current) return; // initialize map only once
        invalidateParentRef.current = invalidateParent;

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
            setCurLocation({latitude: e.result.center[1], longitude: e.result.center[0]});
            });

        map.current.on('click', function (e) {
            if (e.originalEvent && e.originalEvent.target.classList.contains('poi-marker')) {
                return;
            }
            // Use queryRenderedFeatures to inspect features under the mouse
            let features = map.current.queryRenderedFeatures(e.point);

            if (features.length) {
                let feature = features[0];

                // Display the feature information
                let popup = createAddNewPoiPopup(
                    e.lngLat, feature,
                    invalidateParentRef.current);
                popup.addTo(map.current);
            } else {
                alert('No features at clicked point');
            }
        });


    }, []);

    useEffect(() => {
        // console.log('Cur location:', curLocation);
        if (curLocation && Object.keys(curLocation).length > 0 && curLocation.latitude && curLocation.longitude) {
            // console.log('Setting location:', curLocation);
            const zoom = map.current.getZoom();
            map.current.flyTo({
                center: [curLocation.longitude, curLocation.latitude],
                essential: true,
                zoom: zoom
            });
        }

    }, [curLocation]);

    useEffect(() => {
        if (pois && pois.length > 0) {
            addMarkers().then();

            const bounds = new mapboxgl.LngLatBounds();
            pois.forEach(point => {
                bounds.extend([point.longitude, point.latitude]);
            });
            map.current.fitBounds(bounds, {padding: 200});

            setCurLocation(bounds.getCenter());
        }
    }, [pois]);

    useEffect(() => {
        // Close all open popups
        Object.keys(markers.current).forEach((id) => {
            const popup = markers.current[id].getPopup();
            if (popup && popup.isOpen()) {
                popup.remove(); // This should close the popup in Mapbox
            }
        });
        if (curPoiShortId && markers.current[curPoiShortId]) {
            markers.current[curPoiShortId].togglePopup();
        }
    }, [curPoiShortId]);


    return (
        <div>
            <div ref={mapContainer} className="map-container" />
        </div>
    );

}

export default PoiMap;