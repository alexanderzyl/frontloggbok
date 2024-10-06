import React, {useEffect, useState} from 'react';
import {Select, Space, Tag, Typography} from "antd";
import {getAuthHeaders} from "./utils/auth";
import axios from "axios";
import {navigate_texts, navigate_options, setNavigateOptions} from "./utils/poi_attributes";

const { Title } = Typography;

const backendUrl = process.env.REACT_APP_BACKEND_URL;
const FlyerEditor = ({markdown, setMarkdown, poi, invalidateParent}) => {
    const [popupOptions, setPopupOptions] = useState(navigate_options);
    const handleMarkdownChange = (e) => {
        setMarkdown(e.target.value);
    };

    useEffect(() => {
        if (poi !== null && poi !== undefined) {
            const newPopupOptions = setNavigateOptions(poi.attributes);
            setPopupOptions(newPopupOptions);
        }
    }, [poi]);

    const handleTagClose = async (removedTag) => {
        const headers = getAuthHeaders();
        const updateData = { 'poi_short_id': poi.short_id, 'key': removedTag, 'value': '0' };
        await axios.put(`${backendUrl}/user/change_poi_attribute`, updateData, { headers })
            .then(() => {
                invalidateParent();
                setPopupOptions(prevOptions => ({ ...prevOptions, [removedTag]: false }));
            })
            .catch(error => console.error('Failed to update the group:', error));
    };

    const handleSelectChange = async (key) => {
        const headers = getAuthHeaders();
        const updateData = { 'poi_short_id': poi.short_id, 'key': key, 'value': '1' };
        await axios.put(`${backendUrl}/user/change_poi_attribute`, updateData, { headers })
            .then(() => {
                invalidateParent();
                setPopupOptions(prevOptions => ({ ...prevOptions, [key]: true }));
            })
            .catch(error => console.error('Failed to update the group:', error));
    };

    return (
        <>
            <Title level={4}>Edit Popup options</Title>
            <Space direction="vertical">
                {Object.entries(popupOptions).map(([key, value]) => value && (
                    <Tag key={key} closable onClose={() => handleTagClose(key)}>
                        {navigate_texts?.[key] || key}
                    </Tag>
                ))}
                <Select
                    placeholder="+ Add Tag"
                    style={{ width: '100%', minWidth: '250px' }} // Optional: Set overall width for dropdown
                    onChange={handleSelectChange}
                    value={null}
                    dropdownStyle={{ maxWidth: 'calc(100vh - 0px)' }} // Optional: Set overall max-width for dropdown
                >
                    {Object.entries(navigate_texts)
                        .filter(([key]) => !popupOptions[key])
                        .map(([key, label]) => (
                            <Option key={key} value={key} style={{ maxWidth: '300px' }}> {/* Set max width for options */}
                                <span style={{
                                    display: 'inline-block',
                                    width: '100%',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}>
                        {label}
                    </span>
                            </Option>
                        ))}
                </Select>
            </Space>
            {/*<Title level={4}>Edit Information panel </Title>*/}
            {/*<TextArea rows={10} value={markdown} onChange={handleMarkdownChange} />*/}
        </>
    );
}

export default FlyerEditor;