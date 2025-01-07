import { Carousel } from 'antd';

const images = [
    '/public/images/slider1.png',
    '/public/images/slider2.png',
    '/public/images/slider3.png',
];

const ImageSlider = () => {
    const settings = {
        autoplay: true,
        draggable: true,
        dots: true,
        effect: 'fade',
        easing: 'ease-in-out',
        autoplaySpeed: 2000,
        pauseOnHover: true,
        swipeToSlide: true,
        className: 'slider-container'
    };

    return (
        <div className="m-4 mb-4 mb-0 bg-gray-100 rounded-lg shadow-md overflow-hidden">
            <Carousel {...settings}>
                {images.map((image, index) => (
                    <div key={index} className="slide-item">
                        <img
                            src={image}
                            alt={`Slide ${index + 1}`}
                            className="w-full h-[400px] rounded-lg object-cover transition-transform duration-500 hover:scale-105"
                        />
                    </div>
                ))}
            </Carousel>

            <style>{`
                .slider-container {
                    margin: 0 auto;
                }
                .slide-item {
                    padding: 0;
                    transition: all 0.3s ease;
                }
                :global(.ant-carousel .slick-dots li button) {
                    background: #d9d9d9;
                    opacity: 0.4;
                }
                :global(.ant-carousel .slick-dots li.slick-active button) {
                    opacity: 1;
                    background: #1890ff;
                }
            `}</style>
        </div>
    );
};

export default ImageSlider;
