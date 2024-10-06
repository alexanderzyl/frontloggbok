import React, {useEffect, useState} from 'react';
import {Select, Space, Tag, Typography, Calendar, Modal} from "antd";
import {getAuthHeaders} from "./utils/auth";
import axios from "axios";
import moment from 'moment';
import {navigate_options, navigate_texts, readEventDetails, setNavigateOptions} from "./utils/poi_attributes";
const { Title } = Typography;
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const FlyerEditor = ({markdown, setMarkdown, poi, invalidateParent}) => {
    const [popupOptions, setPopupOptions] = useState(navigate_options);
    const [calendarVisible, setCalendarVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);

    useEffect(() => {
        if (poi !== null && poi !== undefined) {
            const newPopupOptions = setNavigateOptions(poi.attributes);
            setPopupOptions(newPopupOptions);
            setSelectedDate(readEventDetails(poi));
        }
    }, [poi]);

    const handleMarkdownChange = (e) => {
        setMarkdown(e.target.value);
    };

    const handleTagClose = async (removedTag) => {
        const headers = getAuthHeaders();
        const updateData = { 'poi_short_id': poi.short_id, 'key': removedTag, 'value': '' };
        await axios.put(`${backendUrl}/user/change_poi_attribute`, updateData, { headers })
            .then(() => {
                invalidateParent();
                // setPopupOptions(prevOptions => ({ ...prevOptions, [removedTag]: false }));
            })
            .catch(error => console.error('Failed to update the group:', error));
    };

    const handleSelectChange = async (key) => {
        const headers = getAuthHeaders();
        if (key === "event") {
            const tomorrowDate = moment().add(1, 'days').toDate();
            setSelectedDate(tomorrowDate);
            const updateData = { 'poi_short_id': poi.short_id, 'key': 'event', 'value': tomorrowDate.toISOString() };
            await axios.put(`${backendUrl}/user/change_poi_attribute`, updateData, { headers })
                .then(() => {
                    invalidateParent();
                    setCalendarVisible(true);
                })
                .catch(error => console.error('Failed to update the group:', error));
        } else {
            const updateData = { 'poi_short_id': poi.short_id, 'key': key, 'value': '1' };
            await axios.put(`${backendUrl}/user/change_poi_attribute`, updateData, { headers })
                .then(() => {
                    invalidateParent();
                    // setPopupOptions(prevOptions => ({ ...prevOptions, [key]: true }));
                })
                .catch(error => console.error('Failed to update the group:', error));
        }
    };

    const handleDateSelect = async (date) => {
        setSelectedDate(date.toDate());
        const headers = getAuthHeaders();
        const updateData = { 'poi_short_id': poi.short_id, 'key': 'event', 'value': date.toISOString() };
        await axios.put(`${backendUrl}/user/change_poi_attribute`, updateData, { headers })
            .then(() => {
                invalidateParent();
                setCalendarVisible(false); // Hide calendar after date is selected
            })
            .catch(error => console.error('Failed to update the event date:', error));
    };

    return (
        <>
            <Title level={4}>Marker buttons</Title>
            <Space direction="vertical">
                {Object.entries(popupOptions).map(([key, value]) => value && (
                    <Tag key={key} closable onClose={() => handleTagClose(key)}>
                        {navigate_texts?.[key] || key}
                    </Tag>
                ))}
                {selectedDate && (
                    <Tag key="event" closable onClose={() => handleTagClose('event')}>
                        Add to Calendar (Event Date: {moment(selectedDate).format('YYYY-MM-DD')})
                    </Tag>
                )}
                <Select
                    placeholder="+ Add Option"
                    style={{ width: '100%', minWidth: '250px' }} // Optional: Set overall width for dropdown
                    onChange={handleSelectChange}
                    value={null}
                    dropdownStyle={{ maxWidth: 'calc(100vh - 0px)' }} // Optional: Set overall max-width for dropdown
                >
                    {Object.entries(navigate_texts)
                        .filter(([key]) => !popupOptions[key])
                        .map(([key, label]) => (
                            <Select.Option key={key} value={key} style={{ maxWidth: '300px' }}> {/* Set max width for options */}
                                <span style={{
                                    display: 'inline-block',
                                    width: '100%',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'}}>
                                    {label}
                                </span>
                            </Select.Option>
                        ))}
                    {!selectedDate && (
                        <Select.Option key="event" value="event">
                            Add to Calendar
                        </Select.Option>
                    )}
                </Select>

                {/* Calendar Modal */}
                <Modal
                    title="Select Event Date"
                    open={calendarVisible}
                    onCancel={() => setCalendarVisible(false)}
                    footer={null}
                >
                    <Calendar fullscreen={false} onSelect={handleDateSelect} />
                </Modal>
            </Space>
            {/*<Title level={4}>Edit Information panel </Title>*/}
            {/*<TextArea rows={10} value={markdown} onChange={handleMarkdownChange} />*/}
        </>
    );
}

export default FlyerEditor;