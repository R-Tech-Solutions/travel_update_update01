import React, { useState, useEffect, useRef } from "react";
import Hero from "../components/Hero/Hero";
import Slider from "../components/Servicess/Slider";
import OurService from "../components/OurService/OurService";
// import Testimonial from "../components/Testimonial/Testimonial";
import Banner from "../components/Banner/Banner";
import BannerPic from "../components/BannerPic/BannerPic";
import BannerImg from "../assets/nature.jpg";
// import OrderPopup from "../components/OrderPopup/OrderPopup";

// Import all video files
import Video1 from "../assets/homepage/1.mp4";
import Video2 from "../assets/homepage/2.mp4";
import Video3 from "../assets/homepage/3.mp4";
import Video4 from "../assets/homepage/4.mp4";
import Video5 from "../assets/homepage/5.mp4";

// Add GSAP imports
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { SplitText } from "gsap/SplitText";

// // Register GSAP plugins
// gsap.registerPlugin(ScrollTrigger, SplitText);

const Home = ({ showMenu, setShowMenu }) => {
  const [orderPopup, setOrderPopup] = React.useState(false);
  const mainRef = useRef(null);

  // useEffect(() => {
  //   // Parallax effect for the main content
  //   gsap.to(mainRef.current, {
  //     yPercent: -30,
  //     ease: "none",
  //     scrollTrigger: {
  //       trigger: mainRef.current,
  //       start: "top top",
  //       end: "bottom top",
  //       scrub: true
  //     }
  //   });
  // }, []);

  const handleOrderPopup = () => {
    setOrderPopup(!orderPopup);
  };

  // Listen for menu close on route change (for mobile nav)
  React.useEffect(() => {
    if (showMenu) {
      const closeMenuOnRoute = () => setShowMenu(false);
      window.addEventListener('popstate', closeMenuOnRoute);
      return () => window.removeEventListener('popstate', closeMenuOnRoute);
    }
  }, [showMenu, setShowMenu]);

  return (
    <div className={`relative min-h-screen bg-gradient-to-b from-black via-black to-blue-900 ${showMenu ? 'overflow-hidden' : 'overflow-x-hidden'}`}
    >
      {/* Blue blurred circle background effect centered, smaller and only in the center */}
      <div className="z-0 absolute opacity-80 rounded-full blur-[120px] w-[300px] h-[300px] bg-blue-500 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      {/* Hero Section with Video Slider */}
      <div className="relative min-h-screen">
        <VideoSlider />
        <div className="relative z-20">
          <Hero />
        </div>
      </div>

      {/* Main content section */}
      <div className="relative z-10">
        <Slider />
        <OurService />
        <BannerPic img={BannerImg} />
        <Banner />
      </div>
    </div>
  );
};

// VideoSlider component with enhanced animations
const VideoSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [progress, setProgress] = useState(0);
  const textRef = useRef(null);
  const progressRef = useRef(null);
  const videoRefs = useRef([]);

  const slides = [
    {
      videoSrc: Video1,
      title: "Wonderful.",
      subtitle: "Island",
      description: "🌴 Wonderful Island — Sri Lanka, a land of breathtaking beauty where golden beaches meet lush mountains. Discover ancient temples, vibrant wildlife, and warm hospitality. From serene tea plantations to rich cultural heritage, every moment on this island is a timeless memory.",
    },
    {
      videoSrc: Video2,
      title: "Camping.",
      subtitle: "Enjoy",
      description:
        "🏕️ Camping — Enjoy the Outdoors Escape into nature's embrace with the joy of camping. From starlit skies to crackling campfires, experience tranquility in the wild. Whether it's mountains, forests, or lakesides, every moment outdoors brings adventure, relaxation, and memories that last a lifetime.",
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

  // Progress bar and auto-slide logic
  useEffect(() => {
    if (isTransitioning) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleSlideChange('next');
          return 0;
        }
        return prev + 0.5;
      });
    }, 25);
    return () => clearInterval(interval);
  }, [currentIndex, isTransitioning]);

  // Slide change handler
  const handleSlideChange = (direction = 'next') => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    let nextIndex;
    if (direction === 'next') {
      nextIndex = (currentIndex + 1) % slides.length;
    } else if (direction === 'prev') {
      nextIndex = (currentIndex - 1 + slides.length) % slides.length;
    } else if (typeof direction === 'number') {
      nextIndex = direction;
    }
    setTimeout(() => {
      setCurrentIndex(nextIndex);
      setIsTransitioning(false);
      setProgress(0);
    }, 400); // match transition duration
  };

  const handleDotClick = (index) => {
    if (index === currentIndex || isTransitioning) return;
    handleSlideChange(index);
  };

  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
      {/* Video slides with enhanced transitions */}
      {slides.map((slide, index) => (
        <div
          key={index}
          ref={el => videoRefs.current[index] = el}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 pointer-events-none ${
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
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

      {/* Enhanced text content with GSAP animations */}
      <div
        ref={textRef}
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-white px-2 sm:px-6 z-20 flex flex-col items-center"
        style={{
          width: "100%",
          maxWidth: "100vw",
          pointerEvents: "auto",
        }}
      >
        <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 text-white text-center break-words leading-tight w-full max-w-[95vw] perspective-1000">
          {slides[currentIndex].title}
        </h1>
        <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-4 text-center break-words leading-tight w-full max-w-[95vw] cursor-pointer">
          {slides[currentIndex].subtitle}
        </h2>
        <p className="text-sm xs:text-base sm:text-lg md:text-xl text-center break-words leading-snug w-full max-w-[95vw]">
          {slides[currentIndex].description}
        </p>
      </div>

      {/* Enhanced navigation with progress bar */}
      <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-4 z-10">
        <div className="w-full max-w-[200px] h-1 bg-white/20 rounded-full overflow-hidden">
          <div 
            ref={progressRef}
            className="h-full bg-white transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? "bg-white scale-125" 
                  : "bg-white bg-opacity-50 hover:bg-opacity-75"
              }`}
              onClick={() => handleDotClick(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Dynamic gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>
    </div>
  );
};

export default Home;
