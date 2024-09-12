import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Link} from "react-router-dom";

const AddPoi = () => {
    const [userPoi, setUserPoi] = useState(null);
    const [poiId, setPoiId] = useState('');
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    const fetchData = async (poi_id) => {
        const token = localStorage.getItem('token');
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
            setUserPoi(res.data);
        } catch (err) {
            console.error('Failed to fetch user data:', err);
            // Optionally, handle token expiration by redirecting to login
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (poiId) {
            fetchData(poiId).then();
        }
    };

    if (!userPoi) return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    POI ID:
                    <input
                        type="text"
                        value={poiId}
                        onChange={(e) => setPoiId(e.target.value)}
                    />
                </label>
                <button type="submit">Submit</button>
            </form>
            <div>Loading...</div>
        </div>
    );

    return (
        <div>
            <h1>Name: {userPoi.name}</h1>
            <p>Description: {userPoi.description}</p>
            <p>
                Id:
                <Link to={`/poi/${userPoi.short_id}`}>
                    {userPoi.short_id}
                </Link>
            </p>
        </div>
    );
};

export default AddPoi;