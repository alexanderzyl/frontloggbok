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

    function handleSwitchChange(checked, record) {
        // Handle the change event (e.g., make an API request to update the is_public field)
        const headers = getAuthHeaders();
        axios.put(`${backendUrl}/user/publish_group/${record.short_id}/${checked}`, {}, { headers })
            .then(response => {
                fetchGroups().then();
            })
            .catch(error => {
                console.error('Failed to update the group:', error);
            });
    }

    function handleDelete(short_id) {
        // Handle the delete event (e.g., make an API request to delete the record)
        const headers = getAuthHeaders();
        axios.delete(`${backendUrl}/user/delete_group/${short_id}`, { headers })
            .then(response => {
                fetchGroups().then();
            })
            .catch(error => {
                console.error('Failed to delete the group:', error);
            });
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
                    checkedChildren="Yes"
                    unCheckedChildren="No"
                    checked={is_public}
                    onChange={(checked) => handleSwitchChange(checked, record)}
                />
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <button onClick={() => handleDelete(record.short_id)}>Remove</button>
            ),
        }
    ];

    useEffect(() => {
        fetchGroups().then();
    }, []);

    return (
        <Table dataSource={groups} columns={columns} rowKey="short_id" />
    );
}
export default GroupTable;

