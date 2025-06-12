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
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, SplitText);

const Home = () => {
  const [orderPopup, setOrderPopup] = React.useState(false);
  const mainRef = useRef(null);

  useEffect(() => {
    // Parallax effect for the main content
    gsap.to(mainRef.current, {
      yPercent: -30,
      ease: "none",
      scrollTrigger: {
        trigger: mainRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });
  }, []);

  const handleOrderPopup = () => {
    setOrderPopup(!orderPopup);
  };

  return (
    <div className="relative" ref={mainRef}>
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

  useEffect(() => {
    // Initialize video refs array
    videoRefs.current = videoRefs.current.slice(0, slides.length);

    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          handleSlideChange();
          return 0;
        }
        return prev + 0.5;
      });
    }, 25);

    // Keyboard navigation
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') {
        handleSlideChange('prev');
      } else if (e.key === 'ArrowRight') {
        handleSlideChange('next');
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      clearInterval(progressInterval);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [currentIndex]);

  useEffect(() => {
    if (textRef.current) {
      // Split text animation with enhanced effects
      const splitTitle = new SplitText(textRef.current.querySelector('h1'), { type: "chars,words" });
      const splitSubtitle = new SplitText(textRef.current.querySelector('h2'), { type: "chars,words" });
      const splitDescription = new SplitText(textRef.current.querySelector('p'), { type: "lines" });

      // Title animation with 3D effect
      gsap.from(splitTitle.chars, {
        opacity: 0,
        y: 50,
        rotationX: 90,
        duration: 1,
        stagger: 0.02,
        ease: "back.out(1.7)",
        transformOrigin: "0% 50% -50",
        onComplete: () => {
          // Add hover effect to title
          gsap.to(splitTitle.chars, {
            duration: 0.3,
            y: -10,
            stagger: 0.01,
            ease: "power2.out",
            paused: true,
            onComplete: () => {
              gsap.to(splitTitle.chars, {
                duration: 0.3,
                y: 0,
                stagger: 0.01,
                ease: "power2.in"
              });
            }
          });
        }
      });

      // Subtitle animation with wave effect
      gsap.from(splitSubtitle.chars, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: {
          amount: 0.5,
          from: "random"
        },
        ease: "elastic.out(1, 0.3)",
        delay: 0.3
      });

      // Description animation with fade and slide
      gsap.from(splitDescription.lines, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.6
      });

      // Add hover effect to subtitle
      const subtitle = textRef.current.querySelector('h2');
      subtitle.addEventListener('mouseenter', () => {
        gsap.to(splitSubtitle.chars, {
          duration: 0.3,
          y: -5,
          stagger: 0.01,
          ease: "power2.out"
        });
      });

      subtitle.addEventListener('mouseleave', () => {
        gsap.to(splitSubtitle.chars, {
          duration: 0.3,
          y: 0,
          stagger: 0.01,
          ease: "power2.in"
        });
      });

      // Cleanup function
      return () => {
        splitTitle.revert();
        splitSubtitle.revert();
        splitDescription.revert();
        subtitle.removeEventListener('mouseenter', () => {});
        subtitle.removeEventListener('mouseleave', () => {});
      };
    }
  }, [currentIndex]);

  const handleSlideChange = (direction = 'next') => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    const nextIndex = direction === 'next' 
      ? (currentIndex + 1) % slides.length 
      : (currentIndex - 1 + slides.length) % slides.length;

    // Fade out current video
    gsap.to(videoRefs.current[currentIndex], {
      opacity: 0,
      duration: 1,
      ease: "power2.inOut"
    });

    // Fade in next video
    gsap.fromTo(videoRefs.current[nextIndex],
      { opacity: 0 },
      { 
        opacity: 1,
        duration: 1,
        ease: "power2.inOut",
        onComplete: () => {
          setCurrentIndex(nextIndex);
          setIsTransitioning(false);
          setProgress(0);
        }
      }
    );
  };

  const handleDotClick = (index) => {
    if (index === currentIndex || isTransitioning) return;
    handleSlideChange(index > currentIndex ? 'next' : 'prev');
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
