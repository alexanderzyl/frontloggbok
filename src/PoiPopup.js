import React, {useEffect, useState} from 'react';
import axios from "axios";
import {navigate_options, navigate_texts, setNavigateOptions} from "./utils/poi_attributes";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

async function getIcon() {
    let iconModule = { default: '../public/icons/star.png' };
    return iconModule.default;
}

function openMap(latitude, longitude) {
    let isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    let url = '';

    if (isIOS) {
        url = `maps://?saddr=&daddr=${latitude},${longitude}`;
    } else { // Android and others
        url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    }

    window.open(url, '_blank');
}

function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

function isApplePlatform() {
    return /Mac|iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

function openAppleMap(latitude, longitude) {
    const url = `maps://?saddr=&daddr=${latitude},${longitude}`;
    window.open(url, '_blank');
}

function openGoogle(latitude, longitude) {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    window.open(url, '_blank');
}

function openSygicMap(latitude, longitude) {
    // Create a Sygic URL
    const sygicUrl = `com.sygic.aura://coordinate|${longitude}|${latitude}|drive`;
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = sygicUrl;
    // Append link to body
    document.body.appendChild(link);
    // Simulate click on the link
    link.click();
    // Remove the link from the document
    document.body.removeChild(link);
}

const async_store_poi = async (poi_id) => {
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
        const res = await axios.put(`${backendUrl}/user/store_poi/${poi_id}`, {}, { headers });
        // window.location.href = '/user';
    } catch (err) {
        console.error('Failed to add user poi:', err);
        window.location.href = '/';
    }
};

const PoiPopup = ({ point }) => {
    const [iconSource, setIconSource] = useState("");
    const [popupOptions, setPopupOptions] = useState(navigate_options);
    const [navigateTexts, setNavigateTexts] = useState(navigate_texts);

    useEffect(() => {
        if (point === null || point === undefined) return;
        const fetchIcon = async () => {
            const icon = await getIcon();
            setIconSource(icon);
        };
        fetchIcon().then();
        const newPopupOptions = setNavigateOptions(point.attributes);
        setPopupOptions(newPopupOptions);
    }, [point]);

    return (
        <div className="PoiInfo">
            <div>
                <img src={iconSource} alt="" />
                <h2>{point.name}</h2>
            </div>
            <div>
                {popupOptions.open_map &&
                    <button onClick={() => openMap(point.latitude, point.longitude)}>{navigateTexts.open_map}</button>}
                {popupOptions.navigate_google &&
                    <button onClick={() => openGoogle(point.latitude, point.longitude)}>{navigateTexts.navigate_google}</button>}
                {popupOptions.navigate_sygic &&
                <button onClick={() => openSygicMap(point.latitude, point.longitude)}>{navigateTexts.navigate_sygic}</button>}
                {popupOptions.navigate_apple && isApplePlatform() &&
                <button onClick={() => openAppleMap(point.latitude, point.longitude)}>{navigateTexts.navigate_apple}</button>}
                {/*<button onClick={() => handleButtonClick("Store")}>Store Poi</button>*/}
            </div>
        </div>
    );
};

export default PoiPopup;