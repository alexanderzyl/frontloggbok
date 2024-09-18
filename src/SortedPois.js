import React, { useEffect, useState } from 'react';
import { Collapse } from 'antd';
import { distance } from '@turf/turf';
import './SortedPois.css';

const { Panel } = Collapse;

const SortedPois = ({ npInfo, curLocation, setCurLocation }) => {
    const [sortedPois, setSortedPois] = useState([]);
    const [selectedKey, setSelectedKey] = useState(null);

    useEffect(() => {
        if (npInfo === undefined || npInfo.pois === undefined) {
            return;
        }
        let from;

        if (!curLocation || !curLocation.latitude || !curLocation.longitude) {
            // If curLocation is not set, use the original list of POIs without sorting
            from = [npInfo.longitude, npInfo.latitude];
        }
        else {
            from = [curLocation.longitude, curLocation.latitude];
        }
        const calculateDistances = () => {
            return npInfo.pois.map((poi) => {
                // const from = [curLocation.longitude, curLocation.latitude];
                const to = [poi.longitude, poi.latitude];
                const dist = distance(from, to, { units: 'kilometers' });
                return { ...poi, distance: dist };
            });
        };

        const sorted = calculateDistances().sort((a, b) => a.distance - b.distance);
        setSortedPois(sorted);

        // Update selectedKey if the selected POI is in the sorted list
        if (selectedKey) {
            const selectedPoi = sorted.find(poi => poi.short_id === selectedKey);
            if (!selectedPoi) {
                setSelectedKey(null);
            }
        }

    }, [curLocation, npInfo]);

    const handlePanelChange = (key) => {
        setSelectedKey(key);
        try {
            const poi = sortedPois.find(poi => poi.short_id === key);
            if (poi) {
                setCurLocation({ latitude: poi.latitude, longitude: poi.longitude });
            }
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className={'sorted-pois'}
             style={{ overflowY: 'scroll', border: '1px solid #ddd', padding: '10px' }}>
            <Collapse onChange={handlePanelChange} accordion={true}>
                {sortedPois.map((poi, index) => (
                    <Panel
                        header={`${poi.name}${poi.distance !== undefined ? ` - ${poi.distance.toFixed(2)} km` : ''}`}
                        key={poi.short_id}
                    >
                        <p>{poi.description}</p>
                    </Panel>
                ))}
            </Collapse>
        </div>
    );
};

export default SortedPois;
