import React, {useEffect, useRef} from 'react';
import mapboxgl from '!mapbox-gl';
import './Map.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxGeocoder from "mapbox-gl-geocoder";
import {createRoot} from "react-dom/client";
import AddNewPoiPopup from "./AddNewPoiPopup";
import {createPoiMarker} from "./Markers";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;



const PoiMap = ({pois, curLocation, setCurLocation, invalidateParent}) => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const geolocate = useRef(null);
    const initLat = 12.5;
    const initLon=  41.8;
    const markers = useRef([]);
    const invalidateParentRef = useRef(invalidateParent);

    const createUserPoiPopup = (point) => {
        const popupContainer = document.createElement('div');
        const root = createRoot(popupContainer);
        root.render(<AddNewPoiPopup point={point}
                                    invalidateParent={invalidateParentRef.current}
        />);
        return new mapboxgl.Popup().setDOMContent(popupContainer);
    };

    async function addMarkers() {
        // Clear existing markers
        if(markers.current.length > 0) {
            markers.current.forEach(marker => {
                marker.remove();
            });
            markers.current = [];
        }
        if (pois && Object.keys(pois).length > 0) {
            // Add markers to the map
            const psels = await Promise.all(pois.map(async point => {
                const el = await createPoiMarker(point);
                return { point, el };
            }));
            console.log('Markers:', psels);
            psels.forEach(({point,el}) => {
                const marker = new mapboxgl.Marker(el)
                    .setLngLat([point.longitude, point.latitude])
                    // .setPopup(createUserPoiPopup(point))
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
            setCurLocation({latitude: e.lngLat.lat, longitude: e.lngLat.lng});
            let popup = createUserPoiPopup(e.lngLat, invalidateParent.current);
            popup.addTo(map.current);
        });


    }, []);

    useEffect(() => {
        if (curLocation && Object.keys(curLocation).length > 0 && curLocation.latitude && curLocation.longitude) {
            console.log('Setting location:', curLocation);
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


    return (
        <div>
            <div ref={mapContainer} className="map-container" />
        </div>
    );

}

export default PoiMap;