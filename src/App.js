import React, { useState, useEffect } from 'react';
// import Gallery from './Gallery';
import Map from './Map';
import ImageCarousel  from "./ImageCarousel";

const App = () => {
    const [navPoints, setNavPoints] = useState([]);
    const [selectedNp, setSelectedNp] = useState([]);
    const [npInfo, setNpInfo] = useState([]);
    const [randomize, setRandomize] = useState(0);

    useEffect(() => {
        fetch('https://backlogbok.onrender.com/api/v1/navpoints/')
            .then(response => response.json())
            .then(data => {
                setNavPoints(data);
                // let selectedImages = [];
                // selectedImages = data.images.slice(100, 110);
                // setImages(selectedImages.map(item => ({
                //     original: item.url,
                //     thumbnail: item.url,
                // })));
            });
    }, []);

    useEffect(() => {
        if (navPoints && navPoints.length > 0) {
            const randomIndex = Math.floor(Math.random() * navPoints.length);
            setSelectedNp(navPoints[randomIndex]);
            fetch(`https://backlogbok.onrender.com/api/v1/navpoint/${navPoints[randomIndex].id}`)
                .then(response => response.json())
                .then(data => {
                    setNpInfo(data);
                });
        }
    }, [randomize]);

    return (
        <div>
            <h1>Loggbok</h1>
            <Map selectedNp={selectedNp} npInfo={npInfo}></Map>
            <button onClick={() => setRandomize(randomize + 1)}>Select random image!</button>  {}
        </div>
    );
};


export default App;
