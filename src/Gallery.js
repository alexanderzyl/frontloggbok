import React from 'react';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';

const images = [
    {
        original: 'https://placekitten.com/800/400',
        thumbnail: 'https://placekitten.com/150/150',
    },
    {
        original: 'https://placekitten.com/800/401',
        thumbnail: 'https://placekitten.com/150/151',
    },
    {
        original: 'https://placekitten.com/800/402',
        thumbnail: 'https://placekitten.com/150/152',
    },
];

const Gallery = () => {
    return <ImageGallery items={images} />;
};

export default Gallery;
