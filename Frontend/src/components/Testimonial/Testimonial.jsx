import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const testimonialData = [
  {
    id: 1,
    name: "Samuel",
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque reiciendis inventore iste ratione ex alias quis magni at optio",
    img: "https://picsum.photos/101/101",
  },
  {
    id: 2,
    name: "John Doe",
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque reiciendis inventore iste ratione ex alias quis magni at optio",
    img: "https://picsum.photos/102/102",
  },
  {
    id: 3,
    name: "Smith",
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque reiciendis inventore iste ratione ex alias quis magni at optio",
    img: "https://picsum.photos/103/103",
  },
];

const Testimonial = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: "linear",
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
          dots: true
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true
        }
      }
    ]
  };

  return (
    <div className="py-6 bg-black text-white">
      <div className="container mx-auto px-2">
        {/* Header section */}
        <div className="text-center mb-6 max-w-[400px] mx-auto">
          <p className="text-sm bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Testimonial
          </p>
          <h1 className="text-2xl md:text-3xl font-bold mt-1 text-white">What Our Clients Say</h1>
          <p className="text-xs text-gray-300 mt-1">
            Discover what our satisfied customers have to say about their experiences with us.
          </p>
        </div>

        {/* Testimonial slider section */}
        <div className="max-w-[800px] mx-auto">
          <Slider {...settings}>
            {testimonialData.map(({ id, name, text, img }) => (
              <div key={id} className="px-1 md:px-2">
                <div className="flex flex-col justify-center items-center gap-2 text-center shadow-lg p-3 md:p-4 mx-1 md:mx-2 rounded-xl bg-gray-900 relative overflow-hidden border border-gray-800">
                  <img
                    src={img}
                    alt={name}
                    className="rounded-full w-14 h-14 md:w-16 md:h-16 object-cover block mx-auto border-2 border-primary"
                  />
                  <h1 className="text-base md:text-lg font-bold text-white">{name}</h1>
                  <p className="text-gray-300 text-xs md:text-sm">{text}</p>
                  <p className="text-gray-800 text-5xl md:text-7xl font-serif absolute top-0 right-0 -mt-2 -mr-2">
                    ,,
                  </p>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
