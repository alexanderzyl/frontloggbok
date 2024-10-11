import React, { useState } from 'react';
import { Button, notification } from 'antd';
import axios from 'axios';
import {getAuthHeaders} from "./utils/auth";
import {useParams} from "react-router-dom";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const LocationTracker = () => {
    const { shortId } = useParams();
    const [locationSent, setLocationSent] = useState(false);

    const handleSendLocation = () => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    sendLocation(position.coords.latitude, position.coords.longitude);
                },
                (error) => {
                    notification.error({
                        message: 'Error',
                        description: error.message,
                    });
                },
                { enableHighAccuracy: true }
            );
        } else {
            notification.error({
                message: 'Error',
                description: 'Geolocation is not supported by this browser.',
            });
        }
    };

    const sendLocation = (latitude, longitude) => {

        const headers = getAuthHeaders();
        const updateData = { 'short_id': shortId, 'latitude': latitude, 'longitude': longitude };
        axios.put(`${backendUrl}/locate/put`, updateData, { headers })
            .then(() => {
                setLocationSent(true);
                notification.success({
                    message: 'Location Sent',
                    description: 'Your location has been sent successfully.',
                });
            })
            .catch(error => console.error('Failed to update the group:', error));

    };

    const handleRemoveLocation = () => {
        const headers = getAuthHeaders();
        axios.delete(`${backendUrl}/locate/delete/${shortId}`, { headers })
            .then(() => {
                setLocationSent(false);
                notification.success({
                    message: 'Location Removed',
                    description: 'Your location has been removed successfully.',
                });
            })
            .catch(error => console.error('Failed to update the group:', error));
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Button type="primary" onClick={handleSendLocation} disabled={locationSent}>
                Send Location
            </Button>
            <Button type="danger" onClick={handleRemoveLocation} disabled={!locationSent} style={{ marginLeft: '10px' }}>
                Remove Location
            </Button>
            <p style={{ marginTop: '10px' }}>
                {locationSent ? 'Location sent!' : 'Location not sent'}
            </p>
        </div>
    );
};

export default LocationTracker;