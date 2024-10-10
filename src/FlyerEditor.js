import React, {useEffect, useState} from 'react';
import {Select, Space, Tag, Typography, Calendar, Modal, Button, message} from "antd";
import {getAuthHeaders} from "./utils/auth";
import axios from "axios";
import moment from 'moment';
import {navigate_options, navigate_texts, readEventDetails, setNavigateOptions} from "./utils/poi_attributes";
const { Title } = Typography;
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const FlyerEditor = ({markdown, setMarkdown, poi, invalidateParent}) => {
    const [popupOptions, setPopupOptions] = useState(navigate_options);
    const [startCalendarVisible, setStartCalendarVisible] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endCalendarVisible, setEndCalendarVisible] = useState(false);
    const [endDate, setEndDate] = useState(null);

    useEffect(() => {
        if (poi !== null && poi !== undefined) {
            const newPopupOptions = setNavigateOptions(poi.attributes);
            setPopupOptions(newPopupOptions);
            const eventDetails = readEventDetails(poi);
            if (eventDetails) {
                setStartDate(eventDetails.start_date);
                if (eventDetails.end_date) {
                    setEndDate(eventDetails.end_date);
                }
            }
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
            setStartDate(tomorrowDate);
            const updateData = { 'poi_short_id': poi.short_id, 'key': 'event', 'value': tomorrowDate.toISOString() };
            await axios.put(`${backendUrl}/user/change_poi_attribute`, updateData, { headers })
                .then(() => {
                    invalidateParent();
                    setStartCalendarVisible(true);
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

    const handleStartDateSelect = async (date) => {
        setStartDate(date.toDate());
        const headers = getAuthHeaders();
        const updateData = { 'poi_short_id': poi.short_id, 'key': 'event', 'value': date.toISOString() };
        await axios.put(`${backendUrl}/user/change_poi_attribute`, updateData, { headers })
            .then(() => {
                invalidateParent();
                setStartCalendarVisible(false); // Hide calendar after date is selected
            })
            .catch(error => console.error('Failed to update the event date:', error));
    }

    const handleEndDateSelect = async (date) => {
        if (date <= startDate) {
            message.error('End date must be after the start date!');
            return;
        }
        setEndDate(date.toDate());
        const headers = getAuthHeaders();
        const updateData = { 'poi_short_id': poi.short_id, 'key': 'event_end', 'value': date.toISOString() };
        await axios.put(`${backendUrl}/user/change_poi_attribute`, updateData, { headers })
            .then(() => {
                invalidateParent();
                setEndCalendarVisible(false); // Hide calendar after date is selected
            })
            .catch(error => console.error('Failed to update the event date:', error));
    }

    return (
        <>
            <Title level={4}>{poi?.name}</Title>
            <Space direction="vertical">
                {Object.entries(popupOptions).map(([key, value]) => value && (
                    <Tag key={key} closable onClose={() => handleTagClose(key)}>
                        {navigate_texts?.[key] || key}
                    </Tag>
                ))}
                {startDate && (
                    <Tag key="event" closable onClose={() => handleTagClose('event')}>
                        Add to Calendar (Event Date: {moment(startDate).format('YYYY-MM-DD')}
                        {!endDate && (
                        <Button type="primary" size="small" onClick={() => setEndCalendarVisible(true)}>
                            End Date
                        </Button>)}
                        {endDate && (
                            <span> - {moment(endDate).format('YYYY-MM-DD')})</span>
                        )}
                        )
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
                    {!startDate && (
                        <Select.Option key="event" value="event">
                            Add to Calendar
                        </Select.Option>
                    )}
                </Select>

                {/* Calendar Modal */}
                <Modal
                    title="Select Event Date"
                    open={startCalendarVisible}
                    onCancel={() => setStartCalendarVisible(false)}
                    footer={null}
                >
                    <Calendar fullscreen={false}
                              onSelect={handleStartDateSelect}
                              disabledDate={(current) => current <= moment().endOf('day')}
                    />
                </Modal>
                <Modal
                    title="Select End Date"
                    open={endCalendarVisible}
                    onCancel={() => setEndCalendarVisible(false)}
                    footer={null}
                >
                    <Calendar fullscreen={false}
                              onSelect={handleEndDateSelect}
                              disabledDate={(current) => current <= moment(startDate).endOf('day')}
                    />
                </Modal>
            </Space>
            {/*<Title level={4}>Edit Information panel </Title>*/}
            {/*<TextArea rows={10} value={markdown} onChange={handleMarkdownChange} />*/}
        </>
    );
}

export default FlyerEditor;