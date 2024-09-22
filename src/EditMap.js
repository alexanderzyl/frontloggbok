import React, {useEffect, useRef} from 'react';
import mapboxgl from '!mapbox-gl';
import './Map.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxGeocoder from "mapbox-gl-geocoder";
import {createPoiMarker} from "./Markers";
import PoiPopup from "./PoiPopup";
import {createRoot} from "react-dom/client";
import AddNewPoiPopup from "./AddNewPoiPopup";

const createUserPoiPopup = (point) => {
    const popupContainer = document.createElement('div');
    const root = createRoot(popupContainer);
    root.render(<PoiPopup point={point} />);
    return new mapboxgl.Popup().setDOMContent(popupContainer);
};

const createAddNewPoiPopup = (lngLat, feature, group_id, handleInvalidate) => {
    console.log('group_id:', group_id);
    const popupContainer = document.createElement('div');
    const root = createRoot(popupContainer);
    root.render(<AddNewPoiPopup lngLat={lngLat} feature={feature} group_id={group_id}
                                invalidateParent={handleInvalidate} />);
    return new mapboxgl.Popup().setLngLat(lngLat).setDOMContent(popupContainer);
}


mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const GroupMap = ({curLocation, setCurLocation, groupData, invalidateParent}) => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const geolocate = useRef(null);
    const initLat = 12.5;
    const initLon=  41.8;
    const markers = useRef([]);
    const groupDataRef = useRef(groupData);
    const invalidateParentRef = useRef(invalidateParent);

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
                el.classList.add('poi-marker');
                return { point, el };
            }));
            psels.forEach(({point,el}) => {
                const marker = new mapboxgl.Marker(el)
                    .setLngLat([point.longitude, point.latitude])
                    .setPopup(createUserPoiPopup(point))
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
                    groupDataRef.current.short_id,
                    invalidateParentRef.current);
                popup.addTo(map.current);
            } else {
                alert('No features at clicked point');
            }
        });

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
        groupDataRef.current = groupData;
        if (groupData && Object.keys(groupData).length > 0) {
            map.current.flyTo({
                center: [groupData.longitude, groupData.latitude],
                essential: true,
                zoom: 12
            });
            addMarkers().then();
        }
    }, [groupData]);

    useEffect(() => {
        if (invalidateParent) {
            invalidateParentRef.current = invalidateParent;
        }
    }, [invalidateParent]);
    const handleInvalidate = () => {
        invalidateParentRef.current();
    }

    return (
        <div>
            <div ref={mapContainer} className="map-container" />
        </div>
    );

}

export default GroupMap;