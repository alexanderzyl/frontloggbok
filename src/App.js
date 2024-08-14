import React, { useState, useEffect } from 'react';
// import Gallery from './Gallery';
import Map from './Map';
import ImageCarousel  from "./ImageCarousel";

const App = () => {
    const [images, setImages] = useState([]);
    const [coordinates, setCoordinates] = useState([]);
    const [imagesMetadata, setImagesMetadata] = useState([]);
    const [selectedImage, setSelectedImage] = useState([]);
    const [randomize, setRandomize] = useState(0); // <-- Add this line

    useEffect(() => {
        fetch('https://backlogbok.onrender.com/api/v1/profiles/2')
            .then(response => response.json())
            .then(data => {
                setImagesMetadata(data.images);
                let selectedImages = [];
                selectedImages = data.images.slice(100, 110);
                setImages(selectedImages.map(item => ({
                    original: item.url,
                    thumbnail: item.url,
                })));
                setCoordinates(selectedImages.map(item => [item.longitude, item.latitude]));
            });
    }, []);

    useEffect(() => {
        if (imagesMetadata.length > 0) {
            const randomIndex = Math.floor(Math.random() * imagesMetadata.length);
            setSelectedImage(imagesMetadata[randomIndex]);
        }
    }, [randomize]); // <-- Add this line

    return (
        <div>
            <h1>Loggbok</h1>
            {/*<ImageCarousel images={images}></ImageCarousel>*/}
            <Map coordinates={coordinates} selectedImage={selectedImage}></Map>
            <button onClick={() => setRandomize(randomize + 1)}>Select random image!</button>  {/* <-- Add this line */}
        </div>
    );
};


export default App;
