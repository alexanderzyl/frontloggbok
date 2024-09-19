import React, { useEffect, useState } from 'react';
import {Table, Switch, Tooltip, Button, message} from 'antd';
import {CopyOutlined, LinkOutlined} from '@ant-design/icons';
import axios from 'axios';
import EditableCell from './EditableCell';
import {getAuthHeaders} from "./utils/auth";
import {getAllGroups} from "./utils/data_fetchers";

const GroupTable = () => {
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const [groups, setGroups] = useState([]);

    const fetchGroups = async () => {
        getAllGroups().then(
            (res) => {
                setGroups(res.data);
            }
        ).catch(
            (err) => {
                console.error('Failed to fetch group data:', err);
            }
        );
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
        if (window.confirm("Are you sure you want to delete this group?")) {
            const headers = getAuthHeaders();
            axios.delete(`${backendUrl}/user/delete_group/${short_id}`, { headers })
                .then(() => fetchGroups())
                .catch(error => console.error('Failed to delete the group:', error));
        }
    };

    const handleCopyLink = (shortId) => {
        const link = `${window.location.origin}/g/${shortId}`;
        navigator.clipboard.writeText(link).then(
            () => {
                message.success('Link copied to clipboard!').then();
            },
            (err) => {
                message.error('Failed to copy link').then();
            }
        );
    };


    function handleEdit(short_id) {

    };

    const navigateToLink = (shortId) => {
        window.location.href = `/g/${shortId}`;
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
            title: 'Details',
            key: 'details',
            render: (text, record) => (
                <>
                    {record.is_public ? (
                        <div>
                            <Tooltip title="Navigate to link">
                                <Button
                                    icon={<LinkOutlined />}
                                    onClick={() => navigateToLink(record.short_id)}
                                    style={{ marginRight: '8px' }}
                                />
                            </Tooltip>
                            <Tooltip title="Copy link">
                                <Button
                                    icon={<CopyOutlined />}
                                    onClick={() => handleCopyLink(record.short_id)}
                                    style={{ marginLeft: '8px' }}
                                />
                            </Tooltip>
                        </div>
                    ) : (
                        <button onClick={() => handleEdit(record.short_id)}>Edit</button>
                    )}
                </>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <button onClick={() => handleDelete(record.short_id)}>Delete</button>
            ),
        }

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