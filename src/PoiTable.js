import React, {useEffect, useState} from 'react';
import {Button, Switch, Table, Tooltip} from "antd";
import axios from "axios";
import EditableCell from "./EditableCell";
import {render} from "react-dom";
import {getAuthHeaders} from "./utils/auth";
import {useParams} from "react-router-dom";
import {CopyOutlined, DeleteOutlined, EnvironmentOutlined, LinkOutlined, TableOutlined} from "@ant-design/icons";
import {handleCopyLink, handleGotoMap, handleGotoTable, navigateToPublicGroup} from "./utils/navigations";

const PoiTable = ({getPois}) => {
    const { shortId } = useParams();
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    const [userPois, setUserPois] = useState([]);
    const [hasGroups, setHasGroups] = useState(false);

    const fetchUserPois = () => {
            getPois(shortId).then(
                (res) => {
                    console.log('Fetched user pois:', res.data);
                    setUserPois(res.data);
                }
            ).catch(
                (err) => {
                    console.error('Failed to fetch poi data:', err);
                }
            );
    }

    const handleSwitchChange = (checked, record) => {
        // Handle the change event (e.g., make an API request to update the is_public field)
        const headers = getAuthHeaders();
        axios.put(`${backendUrl}/user/publish_poi/${record.short_id}/${checked}`, {}, { headers })
            .then(response => {
                fetchUserPois();
            })
            .catch(error => {
                console.error('Failed to update the poi:', error);
            });
    };

    const handleDelete = (short_id) => {
        if (window.confirm("Are you sure you want to delete this point?")) {
            const headers = getAuthHeaders();
            axios.delete(`${backendUrl}/user/delete_poi/${short_id}`, {headers})
                .then(response => {
                    fetchUserPois();
                })
                .catch(error => {
                    console.error('Failed to delete the poi:', error);
                });
        }
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
        ...(hasGroups ? [
        {
            title: 'Groups',
            dataIndex: 'user_poi_groups',
            key: 'user_poi_groups',
            render: (text, record) => (
                <div>
                    {text.map(group => (
                        <div key={group.name} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                            <div style={{ marginRight: '8px' }}>{group.name}</div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                {group.is_public ? (
                                    <>
                                        <Tooltip title="Navigate to link" style={{ marginRight: '8px' }}>
                                            <Button
                                                icon={<LinkOutlined />}
                                                onClick={() => navigateToPublicGroup(group.short_id)}
                                                style={{ marginRight: '8px' }}
                                            />
                                        </Tooltip>
                                        <Tooltip title="Copy link">
                                            <Button
                                                icon={<CopyOutlined />}
                                                onClick={() => handleCopyLink(group.short_id)}
                                                style={{ marginLeft: '8px' }}
                                            />
                                        </Tooltip>
                                    </>
                                ) : (
                                    <>
                                        <Tooltip title="Edit in table" style={{ marginRight: '8px' }}>
                                            <Button
                                                icon={<TableOutlined />}
                                                onClick={() => handleGotoTable(group.short_id)}
                                                style={{ marginRight: '8px' }}
                                            />
                                        </Tooltip>
                                        <Tooltip title="Edit in map">
                                            <Button
                                                icon={<EnvironmentOutlined />}
                                                onClick={() => handleGotoMap(group.short_id)}
                                                style={{ marginLeft: '8px' }}
                                            />
                                        </Tooltip>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ),
        }] : []),
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
            title: 'View',
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
            render: (text, record) => (
                <DeleteOutlined
                    onClick={() => handleDelete(record.short_id)}
                    style={{ cursor: 'pointer', color: 'red' }}
                />
            ),
        }
    ];

    useEffect(() => {
        fetchUserPois();
    }, []);

    useEffect(() => {
        if (userPois && userPois.length > 0) {
            // Check if any user data contains the 'user_poi_groups' field
            setHasGroups(userPois.some(record => record.user_poi_groups));
        }
    }, [userPois]);

    return (<Table columns={columns} dataSource={userPois} rowKey="shortId" />);
}

export default PoiTable;