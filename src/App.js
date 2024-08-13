import React, { useState, useEffect } from 'react';
import Gallery from './Gallery';
import Map from './Map';

const App = () => {
    // console.log("App component is rendering");
    const [images, setImages] = useState([]);

    useEffect(() => {
        // console.log('useEffect has been called');
        fetch('https://backlogbok.onrender.com/api/v1/profiles/2')
            .then(response => response.json())
            .then(data => {
                // console.log('data:', data);
                setImages(data.images.slice(0, 10).map(item => ({
                original: item.url,
                thumbnail: item.url,})));
            });
    }, []);


    return (
        <div>
            <h1>Loggbok</h1>
            <Gallery images={images} />
            <Map></Map>
        </div>
    );
};


export default App;
