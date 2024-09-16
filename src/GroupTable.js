import React, {useEffect, useState} from 'react';
import {Switch, Table} from "antd";
import axios from "axios";
const GroupTable = () => {
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const [groups, setGroups] = useState([]);

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        if (!token || token === 'undefined') {
            // Redirect to login if no token
            window.location.href = '/';
            return;
        }
        return {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        };
    }

    const fetchGroups = async () => {

        try {
            const headers = getAuthHeaders();
            const res = await axios.get(`${backendUrl}/user/groups`, { headers });
            console.log('User Groups: ', res.data);
            setGroups(res.data);
        } catch (err) {
            console.error('Failed to fetch group data:', err);
        }
    }

    // class UserPoiGroup(BaseModel):
    // short_id: str
    // name: str
    // description: str
    // latitude: float
    // longitude: float
    // is_public: bool
    // num_user_pois: int

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Latitude',
            dataIndex: 'latitude',
            key: 'latitude',
        },
        {
            title: 'Longitude',
            dataIndex: 'longitude',
            key: 'longitude',
        },
        {
            title: 'Public',
            dataIndex: 'is_public',
            key: 'is_public',
        },
        {
            title: 'User Pois',
            dataIndex: 'num_user_pois',
            key: 'num_user_pois',
        },
    ];

    useEffect(() => {
        fetchGroups().then();
    }, []);

    return (
        <Table dataSource={groups} columns={columns} rowKey="short_id" />
    );
}
export default GroupTable;

