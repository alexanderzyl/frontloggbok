import React, { useState } from 'react';
import axios from "axios";
import { getAuthHeaders } from "./utils/auth";
import { Button, Input, message } from "antd";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const AddNewPoiPopup = ({ lngLat: initialLngLat, name, category, invalidateParent }) => {
    const [poiName, setPoiName] = useState(name);
    const [lngLat, setLngLat] = useState(initialLngLat);
    const [lngLatInput, setLngLatInput] = useState(`${initialLngLat.lat}, ${initialLngLat.lng}`);

    const handleButtonClick = () => {
        const headers = getAuthHeaders();
        const poiData = {
            'name': poiName,
            'latitude': lngLat.lat,
            'longitude': lngLat.lng,
        };
        axios.post(`${backendUrl}/user/add_poi`, poiData, { headers })
            .then((res) => {
                invalidateParent();
                message.success('New POI created successfully!').then();
            })
            .catch((err) => {
                console.error('Failed to create new POI:', err);
            });
    };

    const handleLngLatChange = (e) => {
        const value = e.target.value;
        setLngLatInput(value);
        const regex = /^\s*([-+]?\d{1,2}\.\d+)\s*,\s*([-+]?\d{1,3}\.\d+)\s*$/;
        const match = value.match(regex);
        if (match) {
            const newLngLat = {
                lat: parseFloat(match[1]),
                lng: parseFloat(match[2]),
            };
            setLngLat(newLngLat);
        } else {
            setLngLat(null);
        }
    };

    return (
        <div>
            <Input
                type="text"
                value={poiName}
                onChange={(e) => setPoiName(e.target.value)}
                placeholder="Name"
            />
            <Input
                type="text"
                value={lngLatInput}
                onChange={handleLngLatChange}
                placeholder="Latitude, Longitude"
            />
            <Button
                type="primary"
                onClick={handleButtonClick}
                disabled={!lngLat}
            >
                Add Point
            </Button>
        </div>
    );
};

export default AddNewPoiPopup;