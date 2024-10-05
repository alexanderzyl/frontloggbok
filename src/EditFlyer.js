import React, { useState } from 'react';
import { Tabs, Input } from 'antd';
import ReactMarkdown from 'react-markdown';
import {useParams} from "react-router-dom";

const { TabPane } = Tabs;
const { TextArea } = Input;

const EditFlyer = () => {
    const { shortId } = useParams();
    const [markdown, setMarkdown] = useState(`# Hello World!\n\nThis is a simple markdown example.\n\n## Subheading\n\n- List item 1\n- List item 2`);

    const handleMarkdownChange = (e) => {
        setMarkdown(e.target.value);
    };

    return (
        <div>
            <Tabs defaultActiveKey="1">
                <TabPane tab="Editor" key="1">
                    <TextArea rows={10} value={markdown} onChange={handleMarkdownChange} />
                </TabPane>
                <TabPane tab="Preview" key="2">
                    <ReactMarkdown>{markdown}</ReactMarkdown>
                </TabPane>
            </Tabs>
        </div>
    );
};

export default EditFlyer;