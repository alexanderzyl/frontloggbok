import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import axios from "axios";
import './PublishGroup.css';
import GroupMap from "./GroupMap";
import SortedPois from "./SortedPois";

const PublishPoi = () => {
    const { shortId } = useParams();
    const [groupData, setGroupData] = useState({});
    const [curLocation, setCurLocation] = useState({});

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
        <div className='publish-group'>
            <SortedPois npInfo={groupData} curLocation={curLocation} setCurLocation={setCurLocation} />
            <GroupMap curLocation={curLocation} setCurLocation={setCurLocation} groupData={groupData}/>
        </div>

    );
};

export default PublishPoi;