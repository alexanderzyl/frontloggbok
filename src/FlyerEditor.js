import React, {useEffect, useState} from 'react';
import TextArea from "antd/es/input/TextArea";

const FlyerEditor = ({markdown, setMarkdown}) => {

    const handleMarkdownChange = (e) => {
        setMarkdown(e.target.value);
    };

    return (
        <>
            <TextArea rows={10} value={markdown} onChange={handleMarkdownChange} />
        </>
    );
}

export default FlyerEditor;