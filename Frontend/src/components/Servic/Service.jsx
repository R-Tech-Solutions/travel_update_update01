"use client";
import React, { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import {BackendUrl} from "../../BackendUrl";

// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

// Helper: get image URL for preview (like AddPlace)
const getImageUrl = (img) => {
  if (!img) return "/placeholder.svg";
  
  // Handle full URLs
  if (typeof img === "string" && (img.startsWith("http://") || img.startsWith("https://"))) {
    return img;
  }
  
  // Handle relative paths from backend
  if (typeof img === "string") {
    // Remove any leading slashes to prevent double slashes
    const cleanPath = img.startsWith('/') ? img.substring(1) : img;
    return `${BackendUrl}/${cleanPath}`;
  }
  
  // Handle File objects (if any)
  if (img instanceof File) {
    return URL.createObjectURL(img);
  }
  
  return "/placeholder.svg";
};

const PlaceCard = ({ place, onClick, buttonText = "Book Now" }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { autoAlpha: 0, y: 80, scale: 0.96 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 85%",
            end: "bottom 60%",
            scrub: 0.5, // Smoothly animate as user scrolls
            toggleActions: "play none none reverse",
          },
        }
      );
    }
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <motion.div
      ref={cardRef}
      className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300"
      // Remove initial/whileInView for GSAP to take over scroll animation
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="overflow-hidden relative"
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.3 }}
      >
        <img
          src={getImageUrl(place.main_image)}
          alt={place.title}
          className="w-full h-60 object-cover transition-transform duration-300"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-[#424651]/90 text-white p-4">
          <h5 className="text-xl font-semibold">
            {place.title}
          </h5>

          {place.package_title && (
            <h2 className="text-lg font-medium text-blue-300 mt-1">
              Packages : {place.package_title}
            </h2>
          )}
          {place.description && (
            <p className="text-gray-300 mt-1 text-sm">{place.description}</p>
          )}
        </div>
      </motion.div>
      <div className="p-5 bg-[#424651] text-white">
        <div className="mt-4 flex justify-between items-center">
          <span className="text-lg font-bold">
            ${" "}
            {place.price
              ? Number(place.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
              : "0.00"}
          </span>
          <motion.button
            onClick={() => onClick(place)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {buttonText}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const SectionHeader = ({ title }) => (
  <motion.h1
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.5 }}
    className="text-3xl font-bold mb-10 mt-10"
  >
    {title}
  </motion.h1>
);

// Particle background component (from PlaceView.jsx)
const ParticleBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-white/20 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            scale: Math.random() * 2,
          }}
          animate={{
            y: [null, Math.random() * window.innerHeight],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

export default function TravelService() {
  const navigate = useNavigate();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const smootherRef = useRef(null);
  const mainRef = useRef(null);

  // Add scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch(`${BackendUrl}/api/places/`)
      .then((res) => res.json())
      .then((data) => {
        setPlaces(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // GSAP ScrollSmoother effect
  useEffect(() => {
    if (mainRef.current && !smootherRef.current) {
      smootherRef.current = ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: 1.2,
        effects: true,
      });
    }
    // Always scroll to top on mount (page reload)
    window.scrollTo(0, 0);
    if (smootherRef.current) {
      smootherRef.current.scrollTo(0, true);
    }
    return () => {
      if (smootherRef.current) {
        smootherRef.current.kill();
        smootherRef.current = null;
      }
    };
  }, []);

  const trendingPlaces = places.filter((p) => p.place_type === "trending");
  const adventurePlaces = places.filter((p) => p.place_type === "adventure");
  const hikingPlaces = places.filter((p) => p.place_type === "Hiking");
  const leisurePlaces = places.filter((p) => p.place_type === "Leisure");

  // Remove the getTrendingPlace function and use array indices directly
  const trendingPlace1 = trendingPlaces[0] || {};
  const trendingPlace2 = trendingPlaces[1] || {};
  const trendingPlace3 = trendingPlaces[2] || {};
  const trendingPlace4 = trendingPlaces[3] || {};
  const trendingPlace5 = trendingPlaces[4] || {};

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <section className="relative w-full min-h-screen bg-gradient-to-br from-black via-black to-blue-900 overflow-hidden">
      {/* Blue blurred circle background effect */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600 opacity-40 blur-[180px]" />
      <ParticleBackground />
      <div className="relative z-10" id="smooth-wrapper">
        <div id="smooth-content" ref={mainRef}>
          <div
            className="container mx-auto py-20 px-5"
            style={{ scrollBehavior: "smooth" }} // Enable smooth scroll for anchor navigation
          >
            {/* Trending Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="mb-16"
              style={{ marginTop: "80px" }} // Add margin to push Trending below navbar
            >
              <h1 className="text-3xl font-bold mb-6">Trending</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
                {/* First row - left */}
                <motion.div
                  className="lg:col-span-4 md:col-span-2 col-span-1 relative rounded-lg overflow-hidden h-[400px]"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                  transition={{
                    duration: 0.8,
                    ease: [0.16, 0.77, 0.47, 0.97],
                    delay: 0.15,
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  <img
                    src={getImageUrl(trendingPlace1?.main_image)}
                    alt={trendingPlace1?.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="text-xl font-bold mb-2">{trendingPlace1?.title}</h3>
                    {trendingPlace1?.package_title && (
                      <p className="text-blue-300 mb-2">{trendingPlace1.package_title}</p>
                    )}
                  </div>
                  <button
                    onClick={() => navigate(`/PlaceView/${trendingPlace1?.id}`, { state: { place: trendingPlace1 } })}
                    className="absolute bottom-4 right-4 bg-blue-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Book Now
                  </button>
                </motion.div>
                {/* First row - middle */}
                <motion.div
                  className="lg:col-span-4 md:col-span-2 col-span-1 relative rounded-lg overflow-hidden h-[400px]"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                  transition={{
                    duration: 0.8,
                    ease: [0.16, 0.77, 0.47, 0.97],
                    delay: 0.3,
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  <img
                    src={getImageUrl(trendingPlace2?.main_image)}
                    alt={trendingPlace2?.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="text-xl font-bold mb-2">{trendingPlace2?.title}</h3>
                    {trendingPlace2?.package_title && (
                      <p className="text-blue-300 mb-2">{trendingPlace2.package_title}</p>
                    )}
                  </div>
                  <button
                    onClick={() => navigate(`/PlaceView/${trendingPlace2?.id}`, { state: { place: trendingPlace2 } })}
                    className="absolute bottom-4 right-4 bg-blue-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Book Now
                  </button>
                </motion.div>
                {/* Right column */}
                <motion.div
                  className="lg:col-span-4 lg:row-span-2 md:col-span-2 col-span-1 relative rounded-lg overflow-hidden h-[800px]"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                  transition={{
                    duration: 0.8,
                    ease: [0.16, 0.77, 0.47, 0.97],
                    delay: 0.45,
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  <img
                    src={getImageUrl(trendingPlace3?.main_image)}
                    alt={trendingPlace3?.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="text-xl font-bold mb-2">{trendingPlace3?.title}</h3>
                    {trendingPlace3?.package_title && (
                      <p className="text-blue-300 mb-2">{trendingPlace3.package_title}</p>
                    )}
                  </div>
                  <button
                    onClick={() => navigate(`/PlaceView/${trendingPlace3?.id}`, { state: { place: trendingPlace3 } })}
                    className="absolute bottom-4 right-4 bg-blue-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Book Now
                  </button>
                </motion.div>
                {/* Second row large */}
                <motion.div
                  className="lg:col-span-6 md:col-span-2 col-span-1 relative rounded-lg overflow-hidden h-[400px]"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                  transition={{
                    duration: 0.8,
                    ease: [0.16, 0.77, 0.47, 0.97],
                    delay: 0.6,
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  <img
                    src={getImageUrl(trendingPlace4?.main_image)}
                    alt={trendingPlace4?.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="text-xl font-bold mb-2">{trendingPlace4?.title}</h3>
                    {trendingPlace4?.package_title && (
                      <p className="text-blue-300 mb-2">{trendingPlace4.package_title}</p>
                    )}
                  </div>
                  <button
                    onClick={() => navigate(`/PlaceView/${trendingPlace4?.id}`, { state: { place: trendingPlace4 } })}
                    className="absolute bottom-4 right-4 bg-blue-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Book Now
                  </button>
                </motion.div>
                {/* Second row smaller */}
                <motion.div
                  className="lg:col-span-2 md:col-span-2 col-span-1 relative rounded-lg overflow-hidden h-[400px]"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                  transition={{
                    duration: 0.8,
                    ease: [0.16, 0.77, 0.47, 0.97],
                    delay: 0.75,
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  <img
                    src={getImageUrl(trendingPlace5?.main_image)}
                    alt={trendingPlace5?.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="text-xl font-bold mb-2">{trendingPlace5?.title}</h3>
                    {trendingPlace5?.package_title && (
                      <p className="text-blue-300 mb-2">{trendingPlace5.package_title}</p>
                    )}
                  </div>
                  <button
                    onClick={() => navigate(`/PlaceView/${trendingPlace5?.id}`, { state: { place: trendingPlace5 } })}
                    className="absolute bottom-4 right-4 bg-blue-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Book Now
                  </button>
                </motion.div>
              </div>
            </motion.div>
            {/* Leisure Travel Section */}
            <SectionHeader title="Leisure Travel" />
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              {leisurePlaces.map((place) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  onClick={(place) => navigate(`/PlaceView/${place.id}`, { state: { place } })}
                  buttonText="View Details"
                />
              ))}
            </motion.div>
            {/* Adventure Travel Section */}
            <SectionHeader title="Adventure Travel" />

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              
              {adventurePlaces.map((place) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  onClick={(place) => navigate(`/PlaceView/${place.id}`, { state: { place } })}
                  buttonText="Buy Now"
                />
              ))}
            </motion.div>
            {/* Hiking & Trekking Section */}
            <SectionHeader title="Hiking & Trekking" />
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              {hikingPlaces.map((place) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  onClick={(place) => navigate(`/PlaceView/${place.id}`, { state: { place } })}
                  buttonText="Buy Now"
                />
              ))}
            </motion.div>
            

            
          </div>
        </div>
      </div>
    </section>
  );
}

{/* Travel Guides Section */}

{/* <motion.section
className="mt-28 bg-gray-900 text-white py-10"
initial={{ opacity: 0, scale: 0.9 }}
whileInView={{ opacity: 1, scale: 1 }}
transition={{ duration: 0.8 }}
>
<h2 className="text-2xl font-bold text-center mb-6">Travel Guides</h2>
<Swiper
  slidesPerView={1}
  spaceBetween={30}
  loop={true}
  navigation
  pagination={{ clickable: true }}
  modules={[Navigation, Pagination]}
  className="w-full max-w-4xl mx-auto"
>
  <SwiperSlide>
    <motion.div
      className="bg-gray-800 p-5 rounded-lg text-center shadow-lg"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.3 }}
      >
        {/* You can use a static image or a guide image from backend if available */}
        // <img
        //   src={"/placeholder.svg"}
        //   alt="Travel Guide"
        //   className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-2 border-gray-500"
        // />
//       </motion.div>
//       <p className="text-gray-300 italic">
//         "I have traveled across many countries!"
//       </p>
//       <h4 className="font-semibold mt-2 text-white">Akeel Shihab</h4>
//       <p className="text-sm text-gray-400">Travel Guide</p>
//     </motion.div>
//   </SwiperSlide>
// </Swiper>
// </motion.section> */

