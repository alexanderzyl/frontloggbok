import React, {useEffect, useState} from 'react';
import {navigate_options, navigate_texts, readEventDetails, setNavigateOptions} from "./utils/poi_attributes";
import { atcb_action } from 'add-to-calendar-button';
import moment from 'moment';

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

function openUber(latitude, longitude) {
    const clientId = 'YOUR_UBER_CLIENT_ID';  // Replace with your Uber Client ID
    const url = `https://m.uber.com/ul/?client_id=${clientId}&action=setPickup&dropoff[latitude]=${latitude}&dropoff[longitude]=${longitude}`;

    window.open(url, '_blank');
}

function openBolt(latitude, longitude) {
    const url = `bolt://ride?action=setPickup&destination_latitude=${latitude}&destination_longitude=${longitude}`;

    // Fallback to the Bolt website if the app is not installed
    const fallbackUrl = `https://m.bolt.eu/?action=setPickup&destination_latitude=${latitude}&destination_longitude=${longitude}`;

    const link = document.createElement('a');
    link.href = url;
    link.style.display = 'none';
    document.body.appendChild(link);

    // Try to open the app, and if it fails, open the fallback URL
    link.click();

    setTimeout(() => {
        if (document.visibilityState === 'hidden') {
            // App opened successfully
            document.body.removeChild(link);
        } else {
            // App not found, open the fallback URL
            window.open(fallbackUrl, '_blank');
            document.body.removeChild(link);
        }
    }, 5000);
}


const PoiPopup = ({ point }) => {
    const [iconSource, setIconSource] = useState("");
    const [popupOptions, setPopupOptions] = useState(navigate_options);
    const [navigateTexts, setNavigateTexts] = useState(navigate_texts);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);


    useEffect(() => {
        if (point === null || point === undefined) return;
        const fetchIcon = async () => {
            const icon = await getIcon();
            setIconSource(icon);
        };
        fetchIcon().then();
        const newPopupOptions = setNavigateOptions(point.attributes);
        setPopupOptions(newPopupOptions);
        const eventDetails = readEventDetails(point);
        if (eventDetails) {
            setStartDate(eventDetails.start_date);
            if(eventDetails.end_date) {
                setEndDate(eventDetails.end_date);
            }
        }
    }, [point]);

    const createCalendarEvent = () => {
        const start_date = moment(startDate).format('YYYY-MM-DD');
        const end_date = endDate ? moment(endDate).format('YYYY-MM-DD') : start_date;
        return {
            name: `${point.name}`,
            description: `${point.name}`,
            startDate: start_date,
            endDate: end_date,
            location: `${point.latitude}, ${point.longitude}`,
            options: ['Apple', 'Google', 'iCal', 'Microsoft365', 'Outlook.com', 'Yahoo'],
            timeZone: 'UTC'
        };
    }


    return (
        <div className="PoiInfo">
            <div>
                <img src={iconSource} alt="" />
                <h2>{point.name}</h2>
                <p>LatLng: {point.latitude}, {point.longitude}</p>
            </div>
            <div>
                {popupOptions.open_map &&
                    <button onClick={() => openMap(point.latitude, point.longitude)}>{navigateTexts.open_map}</button>}
                {popupOptions.navigate_google &&
                    <button
                        onClick={() => openGoogle(point.latitude, point.longitude)}>{navigateTexts.navigate_google}</button>}
                {popupOptions.navigate_sygic &&
                    <button
                        onClick={() => openSygicMap(point.latitude, point.longitude)}>{navigateTexts.navigate_sygic}</button>}
                {popupOptions.navigate_apple && isApplePlatform() &&
                    <button
                        onClick={() => openAppleMap(point.latitude, point.longitude)}>{navigateTexts.navigate_apple}</button>}
                {/*{popupOptions.ride_uber &&*/}
                {/*    <button onClick={() => openUber(point.latitude, point.longitude)}>{navigateTexts.ride_uber}</button>}*/}
                {popupOptions.ride_bolt &&
                    <button onClick={() => openBolt(point.latitude, point.longitude)}>{navigateTexts.ride_bolt}</button>}
                {startDate &&
                    <button onClick={() => atcb_action(createCalendarEvent())}>
                        Save the dates: {moment(startDate).format('MMMM Do YYYY')} {endDate && ` - ${moment(endDate).format('MMMM Do YYYY')}`}
                    </button>}
            </div>
        </div>
    );
};

export default PoiPopup;