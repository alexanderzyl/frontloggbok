import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Custom arrow components
function CustomNextArrow(props) {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{ ...style, backgroundColor: 'black' }}
            onClick={onClick}
        />
    );
}

function CustomPrevArrow(props) {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{ ...style, backgroundColor: 'black' }}
            onClick={onClick}
        />
    );
}
const ImageCarousel = ({images}) => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        // stop autoplay
        autoplay: false,
        nextArrow: <CustomNextArrow />,
        prevArrow: <CustomPrevArrow />
    };

    return (
        <div style={{ width: "800px", margin: "0 auto" }}>
            <Slider {...settings}>
                {images.map((image, index) => (
                    <div key={index} style={{ maxHeight: '400px', maxWidth: '800px', overflow: 'hidden' }}>
                        <img src={image.thumbnail} alt={`Slide ${index + 1}`} style={{ width: "100%", height: 'auto' }} />
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default ImageCarousel;
