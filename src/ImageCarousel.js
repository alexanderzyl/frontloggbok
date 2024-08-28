import React, {useEffect,useRef ,useState} from "react";
import {Carousel} from "antd";
import "./ImageCarousel.css";

const ImageCarousel = ({npInfo}) => {

    const contentStyle = {
        height: '160px',
        color: '#fff',
        lineHeight: '160px',
        textAlign: 'center',
        background: '#364d79',
    };

    const [images, setImages] = useState([]);


    useEffect(() => {
        if (npInfo && npInfo.np_images) {
            setImages(npInfo.np_images);
        }
    }, [npInfo]);

    return (<Carousel arrows dotPosition="left" infinite={false} swipeToSlide={true}>
        {images.map((image, index) => (
            <div key={index}>
                <h3 style={contentStyle}>
                    <img src={image.url} alt={`Slide ${index + 1}`} style={{ width: "100%", height: 'auto' }} />
                </h3>
            </div>
        ))}

    </Carousel>);
};

export default ImageCarousel;
