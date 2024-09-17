import React, {useEffect, useState} from 'react';
import { Tabs } from 'antd';
import PoiTable from "./PoiTable";
import GroupTable from "./GroupTable";
import axios from "axios";

const User = () => {
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const [curUser, setCurUser] = useState({});

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        if (!token || token === 'undefined') {
            window.location.href = '/';
            return {};
        }
        return {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        };
    };

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
            label: 'My Groups',
            children: <GroupTable />,
        },
        {
            key: 'points',
            label: 'My Points',
            children: <PoiTable />,
        },
    ];

    return <Tabs defaultActiveKey="groups" items={items} />;
};

export default User;