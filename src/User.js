import React, {useEffect, useState} from 'react';
import { Tabs } from 'antd';
import PoiTable from "./PoiTable";
import GroupTable from "./GroupTable";
import {fetchUser} from "./utils/auth";
import {getAllUserPois} from "./utils/data_fetchers";

const User = () => {
    const [curUser, setCurUser] = useState({});

    useEffect(() => {
        fetchUser().then(userData => {
            setCurUser(userData.data);
        })
        .catch(err => {
            console.error('Failed to fetch user data:', err);
        });
    }, []);

    const items = [
        {
            key: 'points',
            label: 'All Points',
            children: <PoiTable getPois={getAllUserPois} />,
        },
        {
            key: 'groups',
            label: 'All Groups',
            children: <GroupTable />,
        },
    ];

    return <Tabs defaultActiveKey="points" items={items} />;
};

export default User;