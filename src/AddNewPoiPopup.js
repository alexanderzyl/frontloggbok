import React, {useEffect, useState} from 'react';
import axios from "axios";
import {getAuthHeaders} from "./utils/auth";
import {message} from "antd";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const AddNewPoiPopup = ({lngLat, feature, invalidateParent}) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');

    const handleButtonClick = () => {
        const headers = getAuthHeaders();
        const poiData = {
            'name': name,
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

    useEffect(() => {
        if (!feature) return;
        // console.log('Feature properties:', feature.properties);
        if (feature.properties.name) {
            setName(feature.properties.name);
        }
        else if (feature.properties.name_en) {
            setName(feature.properties.name_en);
        }
        else {
            setName('Unknown');
        }
        if (feature.properties.maki) {
            setCategory(feature.properties.maki);
        }
        else {
            setCategory('unknown');
        }

    }, [lngLat, feature]);

    return (
        <div>
            <input type="text" value={name}
                   onChange={(e) => setName(e.target.value)} placeholder="Name"/>
            <button onClick={handleButtonClick}>Add Point</button>
        </div>
    );
};

export default AddNewPoiPopup;