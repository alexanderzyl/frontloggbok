import React, {useState} from 'react';
import axios from "axios";
import {getAuthHeaders} from "./utils/auth";
import {message} from "antd";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const AddNewPoiPopup = ({ lngLat, name, category, invalidateParent }) => {
    const [poiName, setPoiName] = useState(name);

    const handleButtonClick = () => {
        const headers = getAuthHeaders();
        const poiData = {
            'name': poiName,
            'latitude': lngLat.lat,
            'longitude': lngLat.lng,
        };
        // console.log('Adding new POI:', poiData);
        axios.post(`${backendUrl}/user/add_poi`, poiData, { headers })
            .then((res) => {
                invalidateParent();
                message.success('New POI created successfully!').then();
            })
            .catch((err) => {
                console.error('Failed to create new POI:', err);
            });
    };

    return (
        <div>
            <input
                type="text"
                value={poiName}
                onChange={(e) => setPoiName(e.target.value)}
                placeholder="Name"
            />
            <button onClick={handleButtonClick}>Add Point</button>
        </div>
    );
};

export default AddNewPoiPopup;