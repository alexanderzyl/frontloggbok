import React, { useState, useEffect } from 'react';
import Map from './Map';
import ImageCarousel  from "./ImageCarousel";

const App = () => {
    const [navPoints, setNavPoints] = useState([]);
    const [npInfo, setNpInfo] = useState([]);
    // const [randomize, setRandomize] = useState(0);

    useEffect(() => {
        fetch('https://backlogbok.onrender.com/api/v1/navpoints/')
            .then(response => response.json())
            .then(data => {
                setNavPoints(data);
            });
    }, []);

    return (
        <div>
            {/*<h1>Loggbok</h1>*/}
            <Map npInfo={npInfo} setNpInfo={setNpInfo} navPoints={navPoints}></Map>
            <ImageCarousel npInfo={npInfo}></ImageCarousel>
        </div>
    );
};


export default App;
