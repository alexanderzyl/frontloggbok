import React, {useEffect, useRef, useState} from 'react';
import { useParams } from 'react-router-dom';
import axios from "axios";
import mapboxgl from "!mapbox-gl";
import './Map.css';
import {createPoiMarker, createPoiPopup} from "./Markers";

const PublishPoi = () => {
    const { shortId } = useParams();
    const [groupData, setGroupData] = useState(null);

    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    useEffect(() => {
        const fetchData = async (shortId) => {
            try {
                const headers = {
                    'Content-Type': 'application/json'
                }
                const res = await axios.get(`${backendUrl}/group/${shortId}`, { headers });
                // console.log('POI Data:', res.data);
                setGroupData(res.data);
            } catch (err) {
                console.error('Failed to fetch group', err);
            }
        };
        fetchData(shortId).then();
    }, [shortId]);

    return (
        <div>
            <h1>Publish Group</h1>
            <p>Group ID: {shortId}</p>
            <p>Group Data: {JSON.stringify(groupData)}</p>
        </div>
    );
};

export default PublishPoi;