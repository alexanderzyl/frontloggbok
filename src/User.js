import React, {useEffect, useState} from 'react';
import { Tabs } from 'antd';
import PoiTable from "./PoiTable";
import {getAllUserPois} from "./utils/data_fetchers";
import PoiMap from "./PoiMap";

const User = () => {

    const [curLocation, setCurLocation] = useState({});
    const [userPois, setUserPois] = useState([]);

    const fetchUserPois = () => {
        getAllUserPois().then(
            (res) => {
                console.log('User pois:', res.data);
                setUserPois(res.data);
            }
        ).catch(
            (err) => {
                console.error('Failed to fetch poi data:', err);
            }
        );
    }

    useEffect(() => {
        fetchUserPois();
    }, []);

    const invalidateComponent = () => {
        fetchUserPois();
    }

    const items = [
        {
            key: 'map',
            label: 'Map',
            children: <PoiMap pois={userPois}
                              curLocation={curLocation}
                              setCurLocation={setCurLocation}
                              invalidateParent={invalidateComponent}
            />,
        },
        {
            key: 'points',
            label: 'All Points',
            children: <PoiTable pois={userPois} invalidateParent={invalidateComponent}/>,
        },
    ];

    return <Tabs defaultActiveKey="map" items={items}/>;
};

export default User;