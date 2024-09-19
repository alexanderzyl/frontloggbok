import React, {useEffect, useState} from 'react';
import {Switch, Table} from "antd";
import axios from "axios";
import EditableCell from "./EditableCell";
import {render} from "react-dom";
import {getAuthHeaders} from "./utils/auth";

const PoiTable = ({}) => {
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    const [userPois, setUserPois] = useState([]);

    const fetchUserPois = async () => {
        try {
            const headers = getAuthHeaders();
            const res = await axios.get(`${backendUrl}/user/pois`, { headers });
            setUserPois(res.data);
        } catch (err) {
            console.error('Failed to fetch poi data:', err);
        }
    }

    const handleSwitchChange = (checked, record) => {
        // Handle the change event (e.g., make an API request to update the is_public field)
        const headers = getAuthHeaders();
        axios.put(`${backendUrl}/user/publish_poi/${record.short_id}/${checked}`, {}, { headers })
            .then(response => {
                fetchUserPois().then();
            })
            .catch(error => {
                console.error('Failed to update the poi:', error);
            });
    };

    const handleDelete = (short_id) => {
        // Handle the delete event (e.g., make an API request to delete the record)
        const headers = getAuthHeaders();
        axios.delete(`${backendUrl}/user/delete_poi/${short_id}`, { headers })
            .then(response => {
                fetchUserPois().then();
            })
            .catch(error => {
                console.error('Failed to delete the poi:', error);
            });  // Added this closing parenthesis and curly brace
    }

    const handleSave = async (short_id, dataIndex, value) => {
        const headers = getAuthHeaders();
        const updateData = { [dataIndex]: value, 'short_id': short_id };
        await axios.put(`${backendUrl}/user/change_poi_${dataIndex}`, updateData, { headers })
            .then(() => fetchUserPois())
            .catch(error => console.error('Failed to update the group:', error));
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            // sorter: (a, b) => a.name.localeCompare(b.name),
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
            // sorter: (a, b) => a.description.localeCompare(b.description),
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
            // sorter: (a, b) => a.is_public - b.is_public,
        },
        {
            title: '',
            dataIndex: 'short_id',
            key: 'url',
            render: (text, record) => (
                <>
                    {record.is_public ? (
                        <a href={`/p/${record.short_id}`} target="_blank">View</a>
                    ) : (
                        <span>Not published</span>
                    )}
                </>
            ),
        },
        {
            title: '',
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