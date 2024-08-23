import React, { useState, useEffect } from 'react';
import Map from './Map';
import ImageCarousel  from "./ImageCarousel";
import {Button} from "react-bootstrap";

import './App.css';
import PoiInfo from "./PoiInfo";
import SortedPois from "./SortedPois";

const App = () => {
    const [navPoints, setNavPoints] = useState([]);
    const [npInfo, setNpInfo] = useState({});
    const [mode, setMode] = useState('npsState');
    const [npDetailsState, setNpDetailsState] = useState('images');
    const [curLocation, setCurLocation] = useState({});
    const [curPoi, setCurPoi] = useState({});


    useEffect(() => {
        fetch('https://backlogbok.onrender.com/api/v1/navpoints/')
            .then(response => response.json())
            .then(data => {
                setNavPoints(data);
            });
    }, []);

    useEffect(() => {
        if (mode==='poisState') {
            setNpDetailsState('images');
        }
    }, [mode]);

    useEffect(() => {
        if (mode==='poisState') {
            setNpDetailsState('geolocation');
        }
    }, [curLocation]);

    useEffect(() => {
        if (mode==='poisState') {
            setNpDetailsState('poiInfo');
        }
    }, [curPoi]);

    const AdditionalComponent = () => {
        switch (npDetailsState) {
            case 'images':
                // return <SortedPois npInfo={npInfo} />;
                if (npInfo.np_images && npInfo.np_images.length > 0) {
                    return <ImageCarousel npInfo={npInfo} />;
                }
                else {
                    return null;
                }
            case 'geolocation':
                // return null;
                return SortedPois({npInfo});
            case 'poiInfo':
                // return some other component
                return <PoiInfo curPoi={curPoi} setNpDetailsState={setNpDetailsState} />;
            // Add more cases as needed
            default:
                return null;
        }
    };

    return (
        <div className="map-container">
            <div className="map">
                <Map npInfo={npInfo} setNpInfo={setNpInfo} navPoints={navPoints}
                     mode={mode} setMode={setMode} setCurLocation={setCurLocation} setCurPoi={setCurPoi}
                />
            </div>
            {mode === 'poisState' && npDetailsState && (
                <div className={`additional-component ${npDetailsState}`}>
                    <AdditionalComponent/>
                </div>
            )}
        </div>
    );

};


export default App;
