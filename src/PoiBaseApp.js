import React, { useState, useEffect } from 'react';
import Map from './Map';
import ImageCarousel  from "./ImageCarousel";

import './PoiBaseApp.css';
import PoiInfo from "./PoiInfo";
import SortedPois from "./SortedPois";
import axios from "axios";

const backendUrl = process.env.REACT_APP_BACKEND_URL;
const async_store_np = async (np_id) => {
    const token = localStorage.getItem('token');
    console.log('Token:', token);
    if (!token || token === 'undefined') {
        // Redirect to login if no token
        window.location.href = '/';
        return;
    }
    try {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
        const res = await axios.put(`${backendUrl}/user/store_np/${np_id}`, {}, { headers });
        // window.location.href = '/user';
    } catch (err) {
        console.error('Failed to add np:', err);
        window.location.href = '/';
    }
};
const PoiBaseApp = () => {
    const [navPoints, setNavPoints] = useState([]);
    const [npInfo, setNpInfo] = useState({});
    const [mode, setMode] = useState('npsState');
    const [npDetailsState, setNpDetailsState] = useState('plan');
    const [curLocation, setCurLocation] = useState({});
    const [curPoi, setCurPoi] = useState(null);

    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    useEffect(() => {
        fetch(`${backendUrl}/navpoints/`)
            .then(response => response.json())
            .then(data => {
                setNavPoints(data);
            });
    }, []);

    useEffect(() => {
        if (mode==='poisState') {
            setNpDetailsState('plan');
        }
        else if (mode==='npsState') {
            setCurPoi(null);
        }
    }, [mode]);

    useEffect(() => {
        if (mode==='poisState') {
            setNpDetailsState('plan');
        }
    }, [curPoi]);

    const AdditionalComponent = () => {
        switch (npDetailsState) {
            case 'trip':
                return SortedPois({npInfo, curLocation, setCurLocation});
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

    const handleStoreCityButtonClick = () => {
        async_store_np(npInfo.id).then();
    }

    const poiStateButtonName = (npDetailsState === "plan")? "Calculate Distances" : "Back to Overview";

    return (
        <div className="map-container">
            {mode === 'poisState' && npDetailsState && (
                <div className={`additional-component ${npDetailsState}`}>
                    <AdditionalComponent />
                    <button className={"poi-state-button"} onClick={handleStoreCityButtonClick}>
                        Store City
                    </button>
                    <button className={"poi-state-button"} onClick={handlePoiStateButtonClick}>
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


export default PoiBaseApp;
