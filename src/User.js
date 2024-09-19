import React, {useEffect, useState} from 'react';
import { Tabs } from 'antd';
import PoiTable from "./PoiTable";
import GroupTable from "./GroupTable";
import axios from "axios";
import {getAuthHeaders} from "./utils/auth";

const User = () => {
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const [curUser, setCurUser] = useState({});

    const fetchUser = async () => {
        try {
            const headers = getAuthHeaders();
            const res = await axios.get(`${backendUrl}/user/me`, { headers });
            setCurUser(res.data);
        } catch (err) {
            window.location.href = '/';
        }
    };

    useEffect(() => {
        fetchUser().then();
    }, []);

    const items = [
        {
            key: 'groups',
            label: 'All Groups',
            children: <GroupTable />,
        },
        {
            key: 'points',
            label: 'All Points',
            children: <PoiTable />,
        },
    ];

    return <Tabs defaultActiveKey="groups" items={items} />;
};

export default User;