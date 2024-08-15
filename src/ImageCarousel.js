import React, {useEffect,useRef ,useState} from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./ImageCarousel.css";

// Custom arrow components

const ImageCarousel = ({npInfo}) => {
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        // stop autoplay
        autoplay: false,
        arrows: true,
        accessibility: true,
    };

    const sliderRef = useRef();
    const [images, setImages] = useState([]);

    const defaultImage = ["https://via.placeholder.com/200?text=No%20Image%20Available",
        "https://via.placeholder.com/200?text=No%20Image%20Available",
        "https://via.placeholder.com/200?text=No%20Image%20Available",
        "https://via.placeholder.com/200?text=No%20Image%20Available"]

    useEffect(() => {
        if (npInfo && npInfo.np_images) {
            setImages(npInfo.np_images);
        }
    }, [npInfo]);

    return (
        <div style={{ width: "200px", margin: "0 auto", maxHeight: "100px" }}>
            <Slider ref={sliderRef} {...settings} style={{height: "100px"}}>
                {images.map((image, index) => (
                    <div key={index} style={{ maxHeight: '100px', maxWidth: '200px', overflow: 'hidden' }}>
                        <img src={image.url} alt={`Slide ${index + 1}`} style={{ width: "100%", height: 'auto' }} />
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default ImageCarousel;
