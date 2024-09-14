import React from 'react';
import {Table} from "antd";
import {useEffect, useState} from "react";
import axios from "axios";

const PoiTable = ({}) => {
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    const [userPois, setUserPois] = useState([]);

    // class UserPoi(BaseModel):
    // short_id: str
    // name: str
    // description: str
    // latitude: float
    // longitude: float
    // is_public: bool

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
            title: 'Public',
            dataIndex: 'is_public',
            key: 'is_public',
            render: is_public => is_public ? 'Yes' : 'No',
        },
        {
            title: 'url',
            dataIndex: 'short_id',
            key: 'url',
            render: short_id => <a href={`/poi/${short_id}`}>View</a>,
        }
    ];


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token || token === 'undefined') {
            // Redirect to login if no token
            window.location.href = '/';
            return;
        }
        const fetchData = async () => {
            try {
                const headers = {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                }
                const res = await axios.get(`${backendUrl}/user/pois`, { headers });
                console.log('User Pois: ', res.data);
                setUserPois(res.data);
            } catch (err) {
                console.error('Failed to fetch poi data:', err);
            }
        };
        fetchData().then();
    }, []);

    return (<Table columns={columns} dataSource={userPois} rowKey="shortId" />);
}

export default PoiTable;