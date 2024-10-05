import React, {useEffect, useState} from 'react';
import { Tabs } from 'antd';
import PoiTable from "./PoiTable";
import {getAllUserPois} from "./utils/data_fetchers";
import PoiMap from "./PoiMap";
import PoiEditRenderer from "./PoiEditRender";

const User = () => {

    const [curLocation, setCurLocation] = useState({});
    const [userPois, setUserPois] = useState([]);
    const [curPoiShortId, setCurPoiShortId] = useState(null);

    const fetchUserPois = () => {
        getAllUserPois().then(
            (res) => {
                // console.log('User pois:', res.data);
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

    useEffect(() => {
        if (curPoiShortId && userPois.length > 0) {
            const poi = userPois.find(p => p.short_id === curPoiShortId);
            if (poi) {
                setCurLocation({latitude: poi.latitude, longitude: poi.longitude});
            }
        }
    },[curPoiShortId]);

    const invalidateComponent = () => {
        fetchUserPois();
    }

    const poiEditRender = new PoiEditRenderer(invalidateComponent);

    const items = [
        {
            key: 'map',
            label: 'Map',
            children: <PoiMap pois={userPois}
                              curPoiShortId={curPoiShortId}
                              setCurPoiShortId={setCurPoiShortId}
                              curLocation={curLocation}
                              setCurLocation={setCurLocation}
                              poiEditRender={poiEditRender}
                              invalidateParent={invalidateComponent}
            />,
        },
        {
            key: 'points',
            label: 'All Points',
            children: <PoiTable pois={userPois}
                                curPoiShortId={curPoiShortId}
                                setCurPoiShortId={setCurPoiShortId}
                                poiEditRender={poiEditRender}
            />,
        },
    ];

    return <Tabs defaultActiveKey="map" items={items}/>;
};

export default User;