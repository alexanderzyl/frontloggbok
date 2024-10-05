import React, { useState } from 'react';
import { Tabs, Input, Typography } from 'antd';
import ReactMarkdown from 'react-markdown';

const { TabPane } = Tabs;
const { TextArea } = Input;
const { Title } = Typography;

const MarkdownEdit = () => {
    const [markdown, setMarkdown] = useState(`# Hello World!\n\nThis is a simple markdown example.\n\n## Subheading\n\n- List item 1\n- List item 2`);

    const handleMarkdownChange = (e) => {
        setMarkdown(e.target.value);
    };

    return (
        <div>
            <Title level={2}>Markdown Editor and Preview</Title>
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

export default MarkdownEdit;