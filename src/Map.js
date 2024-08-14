import React, {useEffect, useRef} from 'react';
import mapboxgl from 'mapbox-gl';
// import './Map.css';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiYXp5bHNvZnQiLCJhIjoiY2x6NzY3a3ExMDYxbjJpczVyZGxzd2R6biJ9.3Co395qaKUdX4xlZieOj5Q';

const Map = ({coordinates}) => {
    const mapContainer = useRef(null);
    const map = useRef(null);

    useEffect(() => {
        // Only create a new map instance if it does not exist yet
        if (!map.current) {
            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [-74.5, 40],
                zoom: 10
            });
        }

        map.current.on('style.load', () => {
            if (coordinates.length > 0) {
                map.current.panTo(coordinates[0]);
            }
        });

        return () => map.current.remove();
    }, []); // this effect runs once when component mounts, equivalent to componentDidMount

    useEffect(() => {
        if (map.current) { // ensure map object exists
            const handleLoad = () => {
                // Following operations now happen after style load
                if (coordinates?.length) {

                    if (map.current.getSource('markers')) {
                        map.current.removeSource('markers');
                        map.current.removeLayer('markers');
                    }

                    map.current.addSource('markers', {
                        'type': 'geojson',
                        'data': {
                            'type': 'FeatureCollection',
                            'features': coordinates.map((coord, index) => ({
                                'type': 'Feature',
                                'geometry': {
                                    'type': 'Point',
                                    'coordinates': coord
                                },
                                'properties': {
                                    'id': index
                                }
                            }))
                        }
                    });

                    map.current.addLayer({
                        'id': 'markers',
                        'type': 'circle',
                        'source': 'markers',
                        'paint': {
                            'circle-radius': 10,
                            'circle-color': '#007cbf'
                        }
                    });

                    const bounds = coordinates.reduce((bounds, coord) => bounds.extend(coord), new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

                    map.current.fitBounds(bounds, { padding: 20 });
                }
            };

            // Remove existing load listeners if any before adding a new one
            map.current.off('style.load', handleLoad);
            map.current.on('style.load', handleLoad);
        }
    }, [coordinates]);

    return <div ref={mapContainer} style={{ height: '400px' }} />;
};
export default Map;
