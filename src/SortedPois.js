import React, { useState } from 'react';
import { Collapse } from 'antd';
import './SortedPois.css'

const { Panel } = Collapse;

const SortedPois = ({ npInfo, setCurLocation }) => {
    const handlePanelChange = (key) => {
        try {
            const poi = npInfo.pois[+key];
            console.log('poi', poi);
            setCurLocation({ latitude: poi.latitude, longitude: poi.longitude });
        }
        catch (e) {
            console.error(e);
        }
    };

    return(
        <div className={'sorted-pois'}
             style={{ overflowY: 'scroll', border: '1px solid #ddd', padding: '10px' }}>
        <Collapse onChange={handlePanelChange} accordion={true} >
            {npInfo.pois.map((poi, index) => (
                <Panel header={poi.name} key={index}>
                    <p>{poi.description}</p>
                </Panel>
            ))}
        </Collapse>
        </div>
    );
};

export default SortedPois;