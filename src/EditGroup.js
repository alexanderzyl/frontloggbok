import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import './PublishGroup.css';
import SortedPois from "./SortedPois";
import {getOwnGroup} from "./utils/data_fetchers";
import EditMap from "./EditMap";

const PublishPoi = () => {
    const { shortId } = useParams();
    const [groupData, setGroupData] = useState({});
    const [curLocation, setCurLocation] = useState({});

    const fetchData = async (shortId) => {
        getOwnGroup(shortId).then(
            (res) => {
                setGroupData(res.data);
            }
        ).catch(
            (err) => {
                console.error('Failed to fetch group', err);
            }
        );
    };

    useEffect(() => {
        fetchData(shortId).then();
    }, [shortId]);

    return (
        <div className='publish-group'>
            <SortedPois npInfo={groupData} curLocation={curLocation} setCurLocation={setCurLocation} />
            <EditMap curLocation={curLocation} setCurLocation={setCurLocation} groupData={groupData}/>
        </div>

    );
};

export default PublishPoi;