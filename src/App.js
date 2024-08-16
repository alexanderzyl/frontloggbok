import React, { useState, useEffect } from 'react';
import Map from './Map';
import ImageCarousel  from "./ImageCarousel";
import {Button} from "react-bootstrap";

const App = () => {
    const [navPoints, setNavPoints] = useState([]);
    const [npInfo, setNpInfo] = useState({});
    const [mode, setMode] = useState('npsState');

    useEffect(() => {
        fetch('https://backlogbok.onrender.com/api/v1/navpoints/')
            .then(response => response.json())
            .then(data => {
                setNavPoints(data);
            });
    }, []);

    const renderComponents = () => {
        if (mode === 'npsState') {
            return <Map npInfo={npInfo} setNpInfo={setNpInfo} navPoints={navPoints} mode={mode} setMode={setMode} />
        }

        if (mode === 'poisState') {
            return (<>
                <Map npInfo={npInfo} setNpInfo={setNpInfo} navPoints={navPoints} mode={mode} setMode={setMode} />
                <ImageCarousel npInfo={npInfo} />
                <Button onClick={() => setMode('npsState')}>Overview</Button>
            </>)
        }

        // More modes can be added in the future
    }

    return <div>{renderComponents()}</div>;
};


export default App;
