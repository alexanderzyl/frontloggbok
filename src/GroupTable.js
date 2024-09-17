import React, { useEffect, useState } from 'react';
import { Table, Switch } from 'antd';
import axios from 'axios';
import EditableCell from './EditableCell';

const GroupTable = () => {
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const [groups, setGroups] = useState([]);

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

    const fetchGroups = async () => {
        try {
            const headers = getAuthHeaders();
            const res = await axios.get(`${backendUrl}/user/groups`, { headers });
            setGroups(res.data);
        } catch (err) {
            console.error('Failed to fetch group data:', err);
        }
    };

    const handleSave = async (short_id, dataIndex, value) => {
        const headers = getAuthHeaders();
        const updateData = { [dataIndex]: value, 'short_id': short_id };
        await axios.put(`${backendUrl}/user/change_group_${dataIndex}`, updateData, { headers })
            .then(() => fetchGroups())
            .catch(error => console.error('Failed to update the group:', error));
    };

    const handleSwitchChange = (checked, record) => {
        const headers = getAuthHeaders();
        axios.put(`${backendUrl}/user/publish_group/${record.short_id}/${checked}`, {}, { headers })
            .then(() => fetchGroups())
            .catch(error => console.error('Failed to update the group:', error));
    };

    const handleDelete = (short_id) => {
        const headers = getAuthHeaders();
        axios.delete(`${backendUrl}/user/delete_group/${short_id}`, { headers })
            .then(() => fetchGroups())
            .catch(error => console.error('Failed to delete the group:', error));
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <EditableCell
                    value={text}
                    onChange={(value) => handleSave(record.short_id, 'name', value)}
                />
            ),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            render: (text, record) => (
                <EditableCell
                    value={text}
                    onChange={(value) => handleSave(record.short_id, 'description', value)}
                />
            ),
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
        },
    ];

    useEffect(() => {
        fetchGroups().then();
    }, []);

    return (
        <Table
            bordered
            dataSource={groups}
            columns={columns}
            rowClassName="editable-row"
            rowKey="short_id"
        />
    );
};

export default GroupTable;