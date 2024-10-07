import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import Flyer from "./Flyer";
import {getUserPoi} from "./utils/data_fetchers";


const PublishPoi = () => {
    const { shortId } = useParams();
    const [poiData, setPoiData] = useState(null);

    const [markdown, setMarkdown] = useState(`# Hello World!\n\nThis is a simple markdown example.\n\n## Subheading\n\n- List item 1\n- List item 2`);

    const fetchOwnPoi = () => {
        getUserPoi(shortId).then(
            (res) => {
                setPoiData(res.data);
            }
        ).catch(
            (err) => {
                console.error('Failed to fetch own poi data:', err);
                setPoiData(null);
            }
        );
    }
    useEffect(() => {
        fetchOwnPoi();
    }, []);

    return (
        poiData ? (
            <Flyer markdown={markdown} poi={poiData} />
        ) : (
            <div>The point {shortId} doesn't exist or is not public</div>
        )
    );
};

export default PublishPoi;