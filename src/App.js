import React, { useState, useEffect } from 'react';
// import Gallery from './Gallery';
import Map from './Map';
import ImageCarousel  from "./ImageCarousel";

const App = () => {
    const [images, setImages] = useState([]);
    const [coordinates, setCoordinates] = useState([]);

    useEffect(() => {
        fetch('https://backlogbok.onrender.com/api/v1/profiles/2')
            .then(response => response.json())
            .then(data => {
                setImages(data.images.slice(0, 10).map(item => ({
                    original: item.url,
                    thumbnail: item.url,
                })));
                setCoordinates(data.images.slice(0, 10).map(item => [item.longitude, item.latitude]));
            });
    }, []);

    return (
        <div>
            <h1>Loggbok</h1>
            <ImageCarousel images={images}></ImageCarousel>
            <Map coordinates={coordinates}></Map>
        </div>
    );
};


export default App;
