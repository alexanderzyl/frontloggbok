import React, {useEffect, useState} from 'react';
import { Tabs, Input } from 'antd';
import {useParams} from "react-router-dom";
import Flyer from "./Flyer";
import {getOwnPoi} from "./utils/data_fetchers";
import FlyerEditor from "./FlyerEditor";

const { TextArea } = Input;

const EditFlyer = () => {
    const { shortId } = useParams();
    const [ownPoi, setOwnPoi] = useState(null);
    const [markdown, setMarkdown] = useState(`# Hello World!\n\nThis is a simple markdown example.\n\n## Subheading\n\n- List item 1\n- List item 2`);

    const handleMarkdownChange = (e) => {
        setMarkdown(e.target.value);
    };

    const fetchOwnPoi = (shortId) => {
        getOwnPoi(shortId).then(
            (res) => {
                // console.log('Own poi:', res.data);
                setOwnPoi(res.data);
            }
        ).catch(
            (err) => {
                console.error('Failed to fetch own poi data:', err);
            }
        );
    }

    useEffect(() => {
        fetchOwnPoi(shortId);
    }, []);

    const invalidateParent = () => {
        fetchOwnPoi(shortId);
    }

    const items = [
        {
            key: 'editor',
            label: 'Editor',
            children: <FlyerEditor
                markdown={markdown}
                setMarkdown={setMarkdown}
                poi={ownPoi}
                invalidateParent={invalidateParent}
            />,
        },
        {
            key: 'preview',
            label: 'Preview',
            children: <Flyer
                markdown={markdown}
                poi={ownPoi}
            />,
        },
    ];

    return (
        <div>
            <Tabs defaultActiveKey="editor" items={items} />
        </div>
    );
};

export default EditFlyer;