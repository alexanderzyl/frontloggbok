import React, {useEffect, useState} from 'react';
import TextArea from "antd/es/input/TextArea";
import {Space, Switch, Typography} from "antd";
import {getAuthHeaders} from "./utils/auth";
import axios from "axios";
import {navigate_options, setNavigateOptions} from "./utils/poi_attributes";

const { Title } = Typography;

const backendUrl = process.env.REACT_APP_BACKEND_URL;
const FlyerEditor = ({markdown, setMarkdown, poi, invalidateParent}) => {
    const [popupOptions, setPopupOptions] = useState(navigate_options);
    const handleMarkdownChange = (e) => {
        setMarkdown(e.target.value);
    };

    const handleSwitchChange = async (checked, attr) => {
        // console.log(checked, attr);
        const headers = getAuthHeaders();
        const value = checked ? "1" : "0";
        const updateData = { 'poi_short_id': poi.short_id, 'key': attr, 'value': value };
        await axios.put(`${backendUrl}/user/change_poi_attribute`, updateData, { headers })
            .then(() => invalidateParent())
            .catch(error => console.error('Failed to update the group:', error));
    }

    useEffect(() => {
        if (poi !== null && poi !== undefined) {
            const newPopupOptions = setNavigateOptions(poi.attributes);
            setPopupOptions(newPopupOptions);
        }
    }, [poi]);

    return (
        <>
            <Title level={4}>Edit Popup options </Title>
            <Space direction={"vertical"}>
                <Switch checkedChildren="Open Map" unCheckedChildren="No Open Map"
                        checked={popupOptions.open_map}
                        onChange={(checked) => handleSwitchChange(checked, 'open_map')} />
                <Switch checkedChildren="Navigate with Google Maps" unCheckedChildren="No Navigate with Google Maps"
                        checked={popupOptions.navigate_google}
                        onChange={(checked) => handleSwitchChange(checked, 'navigate_google')} />
                <Switch checkedChildren="Navigate with Apple Maps" unCheckedChildren="No Navigate with Apple Maps"
                        checked={popupOptions.navigate_apple}
                        onChange={(checked) => handleSwitchChange(checked, 'navigate_apple')} />
                <Switch checkedChildren="Navigate with Sygic" unCheckedChildren="No Navigate with Sygic"
                        checked={popupOptions.navigate_sygic}
                        onChange={(checked) => handleSwitchChange(checked, 'navigate_sygic')} />
            </Space>
            <Title level={4}>Edit Information panel </Title>
            <TextArea rows={10} value={markdown} onChange={handleMarkdownChange} />
        </>
    );
}

export default FlyerEditor;