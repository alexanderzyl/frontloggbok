import React from "react";
import EditableCell from "./EditableCell";
import {Button, Switch, Tooltip} from "antd";
import {CopyOutlined, DeleteOutlined, EditOutlined, LinkOutlined} from "@ant-design/icons";
import {getAuthHeaders} from "./utils/auth";
import axios from "axios";
import {handleCopyPoiLink, navigateToEditFlyer, navigateToPublicPoi} from "./utils/navigations";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

class PoiEditRenderer {
    constructor(invalidateParent) {
        this.invalidateParent = invalidateParent;
    }

    handleSwitchChange = (checked, record) => {
        const headers = getAuthHeaders();
        axios.put(`${backendUrl}/user/publish_poi/${record.short_id}/${checked}`, {}, { headers })
            .then(() => {
                this.invalidateParent();
            })
            .catch(error => {
                console.error('Failed to update the poi:', error);
            });
    };

    handleDelete = (short_id) => {
        if (window.confirm("Are you sure you want to delete this point?")) {
            const headers = getAuthHeaders();
            axios.delete(`${backendUrl}/user/delete_poi/${short_id}`, {headers})
                .then(() => {
                    this.invalidateParent();
                })
                .catch(error => {
                    console.error('Failed to delete the poi:', error);
                });
        }
    };

    handleSave = async (short_id, dataIndex, value) => {
        const headers = getAuthHeaders();
        const updateData = { [dataIndex]: value, 'short_id': short_id };
        await axios.put(`${backendUrl}/user/change_poi_${dataIndex}`, updateData, { headers })
            .then(() => this.invalidateParent())
            .catch(error => console.error('Failed to update the group:', error));
    };

    getColumns = () => {
        return [
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                render: (text, record) => (
                    <EditableCell
                        value={text}
                        onChange={(value) => this.handleSave(record.short_id, 'name', value)}
                    />
                ),
            },
            {
                title: 'Publish',
                dataIndex: 'is_public',
                key: 'is_public',
                render: (is_public, record) => (
                    <>
                        <Switch
                            checkedChildren="Public"
                            unCheckedChildren="Private"
                            checked={is_public}
                            onChange={(checked) => this.handleSwitchChange(checked, record)}
                        />
                        {record.is_public ? (
                            <>
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
                            </>
                        ) : (
                            <>

                            </>
                        )}
                        <Tooltip title="Edit flyer">
                            <Button
                                icon={<EditOutlined/>}
                                onClick={() => navigateToEditFlyer(record.short_id)}
                                style={{marginRight: '8px'}}
                            />
                        </Tooltip>
                    </>
                ),
            },
            {
                title: 'Actions',
                dataIndex: 'short_id',
                key: 'delete',
                render: (text, record) => (
                    <Tooltip title="Delete">
                        <Button
                            icon={<DeleteOutlined/>}
                            onClick={() => this.handleDelete(record.short_id)}
                            style={{color: 'red'}}
                        />
                    </Tooltip>
                ),
            }
        ];
    };

    renderPoi = (poi) => {
        const columns = this.getColumns();
        return columns.map(column => {
            const { dataIndex, key, title, render } = column;
            const value = poi[dataIndex];

            return (
                <div key={key || dataIndex} style={{ display: 'flex', alignItems: 'flex-start' }}>
                    {render ? render(value, poi) : value.toString()}
                </div>
            );
        });
    };
}

export default PoiEditRenderer;

// Usage Example:
// import PoiEditRenderer from './path-to-this-file';
// const renderer = new PoiEditRenderer(invalidateParentFunction);
// const columns = renderer.getColumns();

// class CustomPoiEditRenderer extends PoiEditRenderer {
//     handleSwitchChange = (checked, record) => {
//         // Custom implementation
//     };
//
//     // Override other methods as needed
// }