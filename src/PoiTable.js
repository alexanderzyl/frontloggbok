import React from 'react';
import {Button, Collapse, Switch, Table, Tooltip} from "antd";
import axios from "axios";
import EditableCell from "./EditableCell";
import {render} from "react-dom";
import {getAuthHeaders} from "./utils/auth";
import {CopyOutlined, DeleteOutlined, LinkOutlined} from "@ant-design/icons";
import {
    handleCopyPoiLink,
    navigateToPublicPoi
} from "./utils/navigations";
import { useMediaQuery } from 'react-responsive';

const { Panel } = Collapse;

const PoiTable = ({pois, invalidateParent}) => {

    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    const handleSwitchChange = (checked, record) => {
        // Handle the change event (e.g., make an API request to update the is_public field)
        const headers = getAuthHeaders();
        axios.put(`${backendUrl}/user/publish_poi/${record.short_id}/${checked}`, {}, { headers })
            .then(() => {
                invalidateParent();
            })
            .catch(error => {
                console.error('Failed to update the poi:', error);
            });
    };

    const handleDelete = (short_id) => {
        if (window.confirm("Are you sure you want to delete this point?")) {
            const headers = getAuthHeaders();
            axios.delete(`${backendUrl}/user/delete_poi/${short_id}`, {headers})
                .then( ()=> {
                    invalidateParent();
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
            .then(() => invalidateParent())
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
                        <div>
                            <Tooltip title="Navigate to link">
                                <Button
                                    icon={<LinkOutlined/>}
                                    onClick={() => navigateToPublicPoi(record.short_id)}
                                    style={{marginRight: '8px'}}
                                />
                            </Tooltip>
                            <Tooltip title="Copy link">
                                <Button
                                    icon={<CopyOutlined/>}
                                    onClick={() => handleCopyPoiLink(record.short_id)}
                                    style={{marginLeft: '8px'}}
                                />
                            </Tooltip>
                            </div>
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
                    style={{cursor: 'pointer', color: 'red'}}
                />
            ),
        }
    ];

    const isMobile = useMediaQuery({ maxWidth: 767 });

    // Function to render the content inside Collapse.Panel
    const renderPanelContent = (poi) => {
        return columns.map(column => {
            const { dataIndex, key, title, render } = column;
            const value = poi[dataIndex];

            return (
                <div key={key || dataIndex}>
                    <strong>{title}: </strong>
                    {render ? render(value, poi) : value.toString()}
                </div>
            );
        });
    };

    return (
        <>
            {isMobile ? (
                // Render Collapse (Accordion) for mobile view
                <Collapse accordion>
                    {pois.map((poi, index) => (
                        <Panel header={poi.name} key={poi.shortId}>
                            {renderPanelContent(poi)}
                        </Panel>
                    ))}
                </Collapse>
            ) : (
                // Render Table for desktop view
                <Table
                    columns={columns}
                    rowClassName="editable-row"
                    dataSource={pois}
                    rowKey="shortId"
                    scroll={{ x: 768 }}
                />
            )}
        </>
    );
}

export default PoiTable;