import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import axios from "axios";

const Poi = () => {
    const { shortId } = useParams();
    const [poiData, setPoiData] = useState(null);

    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    useEffect(() => {
        const fetchData = async (shortId) => {
            try {
                const headers = {
                    'Content-Type': 'application/json'
                }
                const res = await axios.get(`${backendUrl}/poi/${shortId}`, { headers });
                // console.log('POI Data:', res.data);
                setPoiData(res.data);
            } catch (err) {
                console.error('Failed to fetch poi data:', err);
            }
        };
        fetchData(shortId).then();
    }, [shortId]);

    if (!poiData) return <div>Loading...</div>;

    return (
        <div>
            <h2>Name: {poiData.name}</h2>
            <p>Description: {poiData.description}</p>
            <p>Latitude: {poiData.latitude}</p>
            <p>Longitude: {poiData.longitude}</p>
        </div>
    );
};

export default Poi;