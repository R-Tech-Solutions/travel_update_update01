import { useState, useEffect } from "react";
import image1 from "../../assets/places/water.jpg";
import image2 from "../../assets/places/water.jpg";
import image3 from "../../assets/places/water.jpg";
import image4 from "../../assets/places/water.jpg";
import image5 from "../../assets/places/water.jpg";

const Slider = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const fullText = "Welcome To Sri Lanka";

  // Typewriter effect for the heading
  useEffect(() => {
    let i = 0;
    const typing = setInterval(() => {
      if (i < fullText.length) {
        setDisplayText(fullText.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typing);
      }
    }, 100);
    return () => clearInterval(typing);
  }, []);

  const slides = [
    {
      id: 1,
      image: image1,
      title: "Slider 01",
      subtitle: "design",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore, neque? Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum, ex.",
    },
    {
      id: 2,
      image: image2,
      title: "Slider 02",
      subtitle: "design",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore, neque? Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum, ex.",
    },
    {
      id: 3,
      image: image3,
      title: "Slider 03",
      subtitle: "design",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore, neque? Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum, ex.",
    },
    {
      id: 4,
      image: image4,
      title: "Slider 04",
      subtitle: "design",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore, neque? Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum, ex.",
    },
    {
      id: 5,
      image: image5,
      title: "Slider 05",
      subtitle: "design",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore, neque? Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum, ex.",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const goToNext = () => {
    setActiveIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const goToPrev = () => {
    setActiveIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setActiveIndex(index);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Simplified Header without shadow effect */}
      <h1 className="text-center py-2 mt-12 text-4xl font-bold uppercase font-mono text-white">
        {displayText}
        <span className="animate-pulse">|</span>
      </h1>

      {/* Slider Container */}
      <div className="relative h-[70vh] w-full max-w-6xl mx-auto my-8">
        {/* Slides */}
        <div className="relative w-full h-full">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === activeIndex ? "opacity-100 z-10" : "opacity-0"
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover rounded-xl"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              {/* Content */}
              <div className="absolute left-1/2 top-1/4 -translate-x-1/2 w-4/5 max-w-lg text-white z-10 text-center">
                <p className="uppercase tracking-[0.5em]">{slide.subtitle}</p>
                <h2 className="text-5xl font-bold my-4">{slide.title}</h2>
                <p>{slide.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <div className="absolute top-1/2 right-5 -translate-y-1/2 z-20 flex gap-2">
          <button
            onClick={goToPrev}
            className="bg-white/50 w-10 h-10 rounded flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
          >
            &lt;
          </button>
          <button
            onClick={goToNext}
            className="bg-white/50 w-10 h-10 rounded flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
          >
            &gt;
          </button>
        </div>

        {/* Thumbnails */}
        <div className="absolute bottom-5 left-0 right-0 z-20 flex gap-2 justify-center overflow-x-auto px-5 scrollbar-hide">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              onClick={() => goToSlide(index)}
              className={`w-24 h-32 flex-shrink-0 cursor-pointer transition-all ${
                index === activeIndex ? "brightness-150" : "brightness-50"
              }`}
            >
              <img
                src={slide.image}
                alt={`Thumbnail ${slide.title}`}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;