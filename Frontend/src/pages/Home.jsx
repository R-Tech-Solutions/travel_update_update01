import React, { useState, useEffect } from "react";
import Hero from "../components/Hero/Hero";
import BlogsComp from "../components/Blogs/BlogsComp";
import Places from "../components/Places/Places";
import Slider from "../components/Servicess/Slider";
import OurService from "../components/OurService/OurService";
import Testimonial from "../components/Testimonial/Testimonial";
import Banner from "../components/Banner/Banner";
import BannerPic from "../components/BannerPic/BannerPic";
import BannerImg from "../assets/nature.jpg";
import Banner2 from "../assets/travel-cover2.jpg";
import OrderPopup from "../components/OrderPopup/OrderPopup";

// Import all video files
import Video1 from "../assets/homepage/1.mp4";
import Video2 from "../assets/homepage/2.mp4";
import Video3 from "../assets/homepage/3.mp4";
import Video4 from "../assets/homepage/4.mp4";
import Video5 from "../assets/homepage/5.mp4";

const Home = () => {
  const [orderPopup, setOrderPopup] = React.useState(false);

  const handleOrderPopup = () => {
    setOrderPopup(!orderPopup);
  };

  return (
    <div className="relative">
      {/* Hero Section with Video Slider */}
      <div className="h-[1000px] relative">
        <VideoSlider />
        <div className="relative z-20">
          <Hero />
        </div>
      </div>

      {/* Rest of your content */}
      <div className="relative z-10">
        <Slider />
        <OurService />
        <BannerPic img={BannerImg} />
        <Banner />
        <Testimonial />
        <OrderPopup orderPopup={orderPopup} setOrderPopup={setOrderPopup} />
      </div>
    </div>
  );
};


// VideoSlider component with video shadows and text animation
const VideoSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [textAnimation, setTextAnimation] = useState("animate-fadeIn");

  const slides = [
    {
      videoSrc: Video1,
      title: "Wonderful.",
      subtitle: "Island",
      description:"🌴 Wonderful Island — Sri Lanka, a land of breathtaking beauty where golden beaches meet lush mountains. Discover ancient temples, vibrant wildlife, and warm hospitality. From serene tea plantations to rich cultural heritage, every moment on this island is a timeless memory.",
    },
    {
      videoSrc: Video2,
      title: "Camping.",
      subtitle: "Enjoy",
      description:
        "🏕️ Camping — Enjoy the Outdoors Escape into nature’s embrace with the joy of camping. From starlit skies to crackling campfires, experience tranquility in the wild. Whether it’s mountains, forests, or lakesides, every moment outdoors brings adventure, relaxation, and memories that last a lifetime.",
    },
    {
      videoSrc: Video3,
      title: "Adventures.",
      subtitle: "Off Road",
      description: "🚵 Adventures — Off RoadEmbrace the thrill of off-road adventures where rugged trails and untamed landscapes await. Conquer mountains, forests, and muddy terrains with every twist and turn. It's not just the destination — it's the adrenaline-fueled journey that makes every ride unforgettable.",
    },
    {
      videoSrc: Video4,
      title: "Road Trip.",
      subtitle: "Together",
      description: "🚗 Road Trip — TogetherHit the open road with friends and family for an unforgettable journey. Explore scenic routes, discover hidden gems, and create lasting memories along the way. A road trip is more than just travel; it's the joy of togetherness..",
    },
    {
      videoSrc: Video5,
      title: "Feel Nature.",
      subtitle: "Relax",
      description: "🌿 Feel Nature — RelaxDisconnect from the hustle and reconnect with nature. Breathe in the fresh air, listen to the calming sounds of wildlife, and unwind in serene landscapes. Let nature's beauty and tranquility restore your mind, body, and soul.",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      // Start fade out animation
      setTextAnimation("animate-fadeOut");

      // After fade out completes, change slide and fade in
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
        setTextAnimation("animate-fadeIn");
      }, 500); // Match this with your animation duration
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const handleDotClick = (index) => {
    setTextAnimation("animate-fadeOut");
    setTimeout(() => {
      setCurrentIndex(index);
      setTextAnimation("animate-fadeIn");
    }, 500);
  };

  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
      {/* Video slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <video
            className="w-full h-full object-cover"
            src={slide.videoSrc}
            autoPlay
            muted
            loop
            playsInline
          />
        </div>
      ))}

      {/* Text content with animation */}
      <div
        className={`absolute left-10 top-1/2 transform -translate-y-1/2 text-white max-w-md ${textAnimation}`}
      >
        <h1 className="text-5xl md:text-6xl font-bold mb-2 animate-slideUp text-white">
          {slides[currentIndex].title}
        </h1>
        <h2 className="text-3xl md:text-4xl mb-4 animate-slideUp delay-100">
          {slides[currentIndex].subtitle}
        </h2>
        <p className="text-xl animate-slideUp delay-200">
          {slides[currentIndex].description}
        </p>
      </div>

      {/* Navigation dots */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentIndex ? "bg-white" : "bg-white bg-opacity-50"
            }`}
            onClick={() => handleDotClick(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
    </div>
  );
};

export default Home;
