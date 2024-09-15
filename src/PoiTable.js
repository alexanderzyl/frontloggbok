import React, {useEffect, useState} from 'react';
import {Switch, Table} from "antd";
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

    const fetchUserPois = async () => {
        const token = localStorage.getItem('token');
        if (!token || token === 'undefined') {
            // Redirect to login if no token
            window.location.href = '/';
            return;
        }
        try {
            const headers = getAuthHeaders();
            const res = await axios.get(`${backendUrl}/user/pois`, { headers });
            console.log('User Pois: ', res.data);
            setUserPois(res.data);
        } catch (err) {
            console.error('Failed to fetch poi data:', err);
        }
    }

    const handleSwitchChange = (checked, record) => {
        // Handle the change event (e.g., make an API request to update the is_public field)
        console.log(`Checkbox changed for ${record.name}:`, checked);
    };

    const handleDelete = (short_id) => {
        // Handle the delete event (e.g., make an API request to delete the record)
        console.log(`Delete record with short_id:`, short_id);
        const headers = getAuthHeaders();
        axios.delete(`${backendUrl}/user/delete_poi/${short_id}`, { headers })
            .then(response => {
                console.log('Deleted successfully:', response.data);
                fetchUserPois().then();
            })
            .catch(error => {
                console.error('Failed to delete the poi:', error);
            });  // Added this closing parenthesis and curly brace
    }

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
            title: 'Published',
            dataIndex: 'is_public',
            key: 'is_public',
            render: (is_public, record) => (
                <Switch
                    checked={is_public}
                    onChange={(checked) => handleSwitchChange(checked, record)}
                />
            ),
        },
        {
            title: 'url',
            dataIndex: 'short_id',
            key: 'url',
            render: short_id => <a href={`/poi/${short_id}`}>View</a>,
        },
        {
            title: 'Delete',
            dataIndex: 'short_id',
            key: 'delete',
            render: short_id => (
                <a onClick={() => handleDelete(short_id)}>Delete</a>
            ),
        }
    ];

    useEffect(() => {
        fetchUserPois().then();
    }, []);

    return (<Table columns={columns} dataSource={userPois} rowKey="shortId" />);
}

export default PoiTable;