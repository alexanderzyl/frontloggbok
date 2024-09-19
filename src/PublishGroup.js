import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import './PublishGroup.css';
import GroupMap from "./GroupMap";
import SortedPois from "./SortedPois";
import {getGroup} from "./utils/data_fetchers";

const PublishPoi = () => {
    const { shortId } = useParams();
    const [groupData, setGroupData] = useState({});
    const [curLocation, setCurLocation] = useState({});

    const fetchData = async (shortId) => {
        getGroup(shortId).then(
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
            <GroupMap curLocation={curLocation} setCurLocation={setCurLocation} groupData={groupData}/>
        </div>

    );
};

export default PublishPoi;