"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Remove all dummy image imports

// Helper: get image URL for preview (like AddPlace)
const getImageUrl = (img) => {
  if (!img) return "/placeholder.svg";
  if (typeof img === "string" && (img.startsWith("http://") || img.startsWith("https://"))) return img;
  // If backend returns relative path, prepend media URL
  if (typeof img === "string") return `http://127.0.0.1:8000${img}`;
  return "/placeholder.svg";
};

const PlaceCard = ({ place, onClick, buttonText = "Book Now" }) => (
  <motion.div
    className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300"
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
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
        {place.description && (
          <p className="text-gray-300 mt-1 text-sm">{place.description}</p>
        )}
      </div>
    </motion.div>
    <div className="p-5 bg-[#424651] text-white">
      <div className="mt-4 flex justify-between items-center">
        {place.price && <h3 className="text-lg font-bold">$ {place.price}</h3>}
        <motion.button
          onClick={onClick}
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

export default function TravelService() {
  const navigate = useNavigate();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("http://127.0.0.1:8000/api/places/")
      .then((res) => res.json())
      .then((data) => {
        setPlaces(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const trendingPlaces = places.filter((p) => p.place_type === "trending");
  const adventurePlaces = places.filter((p) => p.place_type === "adventure");
  const hikingPlaces = places.filter((p) => p.place_type === "Hiking");
  const leisurePlaces = places.filter((p) => p.place_type === "Leisure");

  const getTrendingPlace = (idx) => trendingPlaces[idx - 1] || trendingPlaces[0] || {};

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-20 px-5">
      {/* Trending Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="mb-16"
      >
        <h1 className="text-3xl font-bold mb-6">Trending</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
          {/* First row - left */}
          <motion.div
            className="lg:col-span-4 md:col-span-2 col-span-1 relative rounded-lg overflow-hidden h-64 md:h-auto"
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
              src={getImageUrl(getTrendingPlace(1)?.main_image)}
              alt={getTrendingPlace(1)?.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <button
              onClick={() => navigate(`/PlaceView/${getTrendingPlace(1)?.id}`)}
              className="absolute bottom-2 right-2 m-[3px] bg-blue-600 hover:bg-teal-700 text-white px-6 py-2 rounded-tl-lg transition-colors"
            >
              Book Now
            </button>
          </motion.div>
          {/* First row - middle */}
          <motion.div
            className="lg:col-span-4 md:col-span-2 col-span-1 relative rounded-lg overflow-hidden h-64 md:h-auto"
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
              src={getImageUrl(getTrendingPlace(2)?.main_image)}
              alt={getTrendingPlace(2)?.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <button
              onClick={() => navigate(`/PlaceView/${getTrendingPlace(2)?.id}`)}
              className="absolute bottom-4 right-4 bg-blue-600 hover:bg-teal-700 text-white px-4 py-1 rounded-md transition-colors"
            >
              Book Now
            </button>
          </motion.div>
          {/* Right column */}
          <motion.div
            className="lg:col-span-4 lg:row-span-2 md:col-span-2 col-span-1 relative rounded-lg overflow-hidden h-64 md:h-96 lg:h-auto"
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
              src={getImageUrl(getTrendingPlace(3)?.main_image)}
              alt={getTrendingPlace(3)?.title}
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => navigate(`/PlaceView/${getTrendingPlace(3)?.id}`)}
              className="absolute bottom-4 right-4 bg-teal-600 hover:bg-teal-700 text-white px-4 py-1 rounded-md transition-colors"
            >
              Book Now
            </button>
          </motion.div>
          {/* Second row large */}
          <motion.div
            className="lg:col-span-6 md:col-span-2 col-span-1 relative rounded-lg overflow-hidden h-64 md:h-auto"
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
              src={getImageUrl(getTrendingPlace(4)?.main_image)}
              alt={getTrendingPlace(4)?.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <button
              onClick={() => navigate(`/PlaceView/${getTrendingPlace(4)?.id}`)}
              className="absolute bottom-4 right-4 bg-blue-600 hover:bg-teal-700 text-white px-4 py-1 rounded-md transition-colors"
            >
              Book Now
            </button>
          </motion.div>
          {/* Second row smaller */}
          <motion.div
            className="lg:col-span-2 md:col-span-2 col-span-1 relative rounded-lg overflow-hidden h-64 md:h-auto"
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
              src={getImageUrl(getTrendingPlace(5)?.main_image)}
              alt={getTrendingPlace(5)?.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <button
              onClick={() => navigate(`/PlaceView/${getTrendingPlace(5)?.id}`)}
              className="absolute bottom-4 right-4 bg-blue-600 hover:bg-teal-700 text-white px-4 py-1 rounded-md transition-colors"
            >
              Book Now
            </button>
          </motion.div>
        </div>
      </motion.div>
      {/* Leisure Travel Section */}
      <SectionHeader title="Leisure Travel" />
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {leisurePlaces.map((place) => (
          <PlaceCard
            key={place.id}
            place={place}
            onClick={() => navigate(`/PlaceView/${place.id}`)}
            buttonText="View Details"
          />
        ))}
      </motion.div>
      {/* Adventure Travel Section */}
      <SectionHeader title="Adventure Travel" />
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {adventurePlaces.map((place) => (
          <PlaceCard
            key={place.id}
            place={place}
            onClick={() => navigate(`/PlaceView/${place.id}`)}
            buttonText="Buy Now"
          />
        ))}
      </motion.div>
      {/* Hiking & Trekking Section */}
      <SectionHeader title="Hiking & Trekking" />
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {hikingPlaces.map((place) => (
          <PlaceCard
            key={place.id}
            place={place}
            onClick={() => navigate(`/PlaceView/${place.id}`)}
            buttonText="Buy Now"
          />
        ))}
      </motion.div>
      {/* Travel Guides Section */}
      <motion.section
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
                <img
                  src={"/placeholder.svg"}
                  alt="Travel Guide"
                  className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-2 border-gray-500"
                />
              </motion.div>
              <p className="text-gray-300 italic">
                "I have traveled across many countries!"
              </p>
              <h4 className="font-semibold mt-2 text-white">Akeel Shihab</h4>
              <p className="text-sm text-gray-400">Travel Guide</p>
            </motion.div>
          </SwiperSlide>
        </Swiper>
      </motion.section>
    </div>
  );
}
