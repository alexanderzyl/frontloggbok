import React, {useEffect, useState} from 'react';
import axios from "axios";
import {getAuthHeaders} from "./utils/auth";
import {message} from "antd";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const AddNewPoiPopup = ({lngLat, feature, group_id}) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('automatically added');

    const handleButtonClick = () => {
        console.log('Add new POI button clicked: ', group_id);
        const headers = getAuthHeaders();
        const poiData = {
            'name': name,
            'description': description,
            'latitude': lngLat.lat,
            'longitude': lngLat.lng,
            'group_short_id': group_id,
        };
        axios.post(`${backendUrl}/user/add_poi`, poiData, { headers })
            .then((res) => {
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
            <input type="text" value={description}
                   onChange={(e) => setDescription(e.target.value)} placeholder="Description"/>
            <button onClick={handleButtonClick}>Add Point</button>
        </div>
    );
};

export default AddNewPoiPopup;