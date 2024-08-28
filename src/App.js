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
    const [npDetailsState, setNpDetailsState] = useState('plan');
    const [curLocation, setCurLocation] = useState({});
    const [curPoi, setCurPoi] = useState(null);


    useEffect(() => {
        fetch('https://backlogbok.onrender.com/api/v1/navpoints/')
            .then(response => response.json())
            .then(data => {
                setNavPoints(data);
            });
    }, []);

    useEffect(() => {
        if (mode==='poisState') {
            setNpDetailsState('plan');
        }
    }, [mode]);

    // useEffect(() => {
    //     if (mode==='poisState') {
    //         console.log('debug geolocation', curLocation);
    //     }
    // }, [curLocation]);

    useEffect(() => {
        if (mode==='poisState') {
            setNpDetailsState('plan');
        }
    }, [curPoi]);

    const AdditionalComponent = () => {
        switch (npDetailsState) {
            case 'trip':
                return SortedPois({npInfo, setCurLocation});
            case 'plan':
                // return some other component
                if (curPoi !== null) {
                    return <PoiInfo curPoi={curPoi} setCurPoi={setCurPoi} />;
                }
                else {
                    if (npInfo.np_images && npInfo.np_images.length > 0) {
                        return <ImageCarousel npInfo={npInfo} />;
                    }
                }
                return null;
            // Add more cases as needed
            default:
                return null;
        }
    };

    const handlePoiStateButtonClick = () => {
        switch (npDetailsState) {
            case 'trip':
                setNpDetailsState('plan');
                return;
            case 'plan':
                setNpDetailsState('trip');
                return;
        }
    }

    const poiStateButtonName = (npDetailsState === "plan")? "Start Trip" : "Stop Trip";

    return (
        <div className="map-container">
            {mode === 'poisState' && npDetailsState && (
                <div className={`additional-component ${npDetailsState}`}>
                    <AdditionalComponent />
                    <button onClick={handlePoiStateButtonClick}>
                        {poiStateButtonName}
                    </button>
                </div>
            )}
            <div className="map">
                <Map
                    npInfo={npInfo}
                    setNpInfo={setNpInfo}
                    navPoints={navPoints}
                    mode={mode}
                    setMode={setMode}
                    setCurLocation={setCurLocation}
                    curLocation={curLocation}
                    setCurPoi={setCurPoi}
                />
            </div>
        </div>
    );


};


export default App;
