"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getPlaces } from "../../ServiceApi/api"; // Import the API function

// Image imports
import BeachImg from "../../assets/nature.jpg";
import MountainImg from "../../assets/cemara.png";
import ForestImg from "../../assets/travel-cover2.jpg";
import CityImg from "../../assets/cemara.png";
import CityImg1 from "../../assets/cemara.png";
import GuideImg from "../../assets/cemara.png";
import Img1 from "../../assets/plc/img1.jpg";
import Img2 from "../../assets/plc/img2.jpg";
import Img3 from "../../assets/plc/img3.jpg";
import Img4 from "../../assets/plc/img4.jpg";
import Img5 from "../../assets/plc/img5.jpg";
import Img6 from "../../assets/plc/img6.jpg";
import Img7 from "../../assets/plc/img7.jpg";
import Img8 from "../../assets/plc/img8.jpg";
import Img9 from "../../assets/plc/img9.jpg";
import Img10 from "../../assets/plc/img10.jpg";
import Img11 from "../../assets/plc/img11.jpg";
import Img12 from "../../assets/plc/img12.jpg";
import Img13 from "../../assets/plc/img13.jpg";
import Img14 from "../../assets/plc/img14.jpg";
import Img15 from "../../assets/plc/img15.jpg";
import Img16 from "../../assets/plc/img16.jpg";
import Img17 from "../../assets/plc/img17.jpg";
import Img18 from "../../assets/plc/img18.jpg";
import Img19 from "../../assets/plc/img19.jpg";
import Img20 from "../../assets/plc/img20.jpg";
import Img21 from "../../assets/plc/img21.jpg";
import Img22 from "../../assets/plc/img22.jpg";
import Img23 from "../../assets/plc/img23.jpg";
import Img24 from "../../assets/plc/img24.jpg";
import Img25 from "../../assets/plc/img25.jpg";
import Img26 from "../../assets/plc/img26.jpg";
import Img28 from "../../assets/plc/img28.jpg";
import Img29 from "../../assets/plc/img29.jpg";
import Img30 from "../../assets/plc/img30.jpg";

// Trending images with IDs
function Home() {
  const navigate = useNavigate();

  const handleClick = (id) => {
    navigate(`/PlaceView/${id}`);
  };

  return null; // Add a return statement or content for the Home function
}

const trendingPlaces = [
  {
    id: 1,
    image: Img1,
    alt: "Cabin",
  },
  {
    id: 2,
    image: Img2,
    alt: "Frosty leaves",
  },
  {
    id: 3,
    image: Img3,
    alt: "Bird",
  },
  {
    id: 4,
    image: Img4,
    alt: "Cabin winter",
  },
  {
    id: 5,
    image: Img5,
    alt: "Yellow flower",
  },
  {
    id: 6,
    image: Img6,
    alt: "Daisies",
  },
  {
    id: 7,
    image: Img7,
    alt: "Yellow flower close-up",
  },
  {
    id: 8,
    image: Img8,
    alt: "City view",
  },
];

// Service Adventure
const Adventure = [
  {
    id: 1,
    title: "Beautiful Beach",
    description: "A breathtaking beach with clear waters.",
    image: Img9,
    price: "$200",
  },
  {
    id: 2,
    title: "Mountain Escape",
    description: "An adventurous retreat in the mountains.",
    image: Img10,
    price: "$150",
  },
  {
    id: 3,
    title: "Enchanted Forest",
    description: "Explore the magical woodland trails.",
    image: Img11,
    price: "$180",
  },
  {
    id: 4,
    title: "City Lights",
    description: "Experience vibrant urban nightlife.",
    image: Img12,
    price: "$250",
  },
  {
    id: 5,
    title: "City Lights",
    description: "Experience vibrant urban nightlife.",
    image: Img13,
    price: "$250",
  },
];

// Service Adventure
const Hiking = [
  {
    id: 1,
    title: "Beautiful Beach",
    description: "A breathtaking beach with clear waters.",
    image: Img14,
    price: "$200",
  },
  {
    id: 2,
    title: "Mountain Escape",
    description: "An adventurous retreat in the mountains.",
    image: Img15,
    price: "$150",
  },
  {
    id: 3,
    title: "Enchanted Forest",
    description: "Explore the magical woodland trails.",
    image: Img16,
    price: "$180",
  },
  {
    id: 4,
    title: "City Lights",
    description: "Experience vibrant urban nightlife.",
    image: Img18,
    price: "$250",
  },
  {
    id: 5,
    title: "City Lights",
    description: "Experience vibrant urban nightlife.",
    image: Img19,
    price: "$250",
  },
  {
    id: 5,
    title: "City Lights",
    description: "Experience vibrant urban nightlife.",
    image: Img20,
    price: "$250",
  },
  {
    id: 5,
    title: "City Lights",
    description: "Experience vibrant urban nightlife.",
    image: Img21,
    price: "$250",
  },
  {
    id: 5,
    title: "City Lights",
    description: "Experience vibrant urban nightlife.",
    image: Img22,
    price: "$250",
  },
];

export default function TravelService() {
  const [leisurePlaces, setLeisurePlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeisurePlaces = async () => {
      try {
        const response = await getPlaces(); // Fetch places from the API
        setLeisurePlaces(response.data.results); // Set the places data
      } catch (error) {
        console.error("Error fetching leisure places:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchLeisurePlaces();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator
  }

  // Function to get trending place by ID
  const getTrendingPlace = (id) => {
    return trendingPlaces.find((place) => place.id === id) || trendingPlaces[0];
  };

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
            whileHover={{ scale: 1.05 }} // Zoom in on hover
          >
            <img
              src={getTrendingPlace(1).image || "/placeholder.svg"}
              alt={getTrendingPlace(1).alt}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <button
              onClick={() => navigate(`/PlaceView/${getTrendingPlace(1).id}`)} // Pass ID to PlaceView
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
            whileHover={{ scale: 1.05 }} // Zoom in on hover
          >
            <img
              src={getTrendingPlace(2).image || "/placeholder.svg"}
              alt={getTrendingPlace(2).alt}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <button
              onClick={() => navigate(`/PlaceView/${getTrendingPlace(2).id}`)} // Pass ID to PlaceView
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
            whileHover={{ scale: 1.05 }} // Zoom in on hover
          >
            <img
              src={getTrendingPlace(3).image || "/placeholder.svg"}
              alt={getTrendingPlace(3).alt}
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => navigate(`/PlaceView/${getTrendingPlace(3).id}`)} // Pass ID to PlaceView
              className="absolute bottom-4 right-4 bg-teal-600 hover:bg-teal-700 text-white px-4 py-1 rounded-md transition-colors"
            >
              Book Now
            </button>
          </motion.div>

          {/* Add the zoom-in effect for the other items similarly... */}
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
            whileHover={{ scale: 1.05 }} // Zoom in on hover
          >
            <img
              src={getTrendingPlace(4).image || "/placeholder.svg"}
              alt={getTrendingPlace(4).alt}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <button
              onClick={() => navigate(`/PlaceView/${getTrendingPlace(4).id}`)} // Pass ID to PlaceView
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
            whileHover={{ scale: 1.05 }} // Zoom in on hover
          >
            <img
              src={getTrendingPlace(5).image || "/placeholder.svg"}
              alt={getTrendingPlace(5).alt}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <button
              onClick={() => navigate(`/PlaceView/${getTrendingPlace(5).id}`)} // Pass ID to PlaceView
              className="absolute bottom-4 right-4 bg-blue-600 hover:bg-teal-700 text-white px-4 py-1 rounded-md transition-colors"
            >
              Book Now
            </button>
          </motion.div>

          {/* Continue applying whileHover={{ scale: 1.05 }} on other items */}
        </div>
      </motion.div>
      {/* trending End */}

      {/* Rest of your code remains the same */}

      {/* Leisure Travel Section */}
      <motion.h1
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-10"
      >
        Leisure Travel
      </motion.h1>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {leisurePlaces.map((place) => (
          <motion.div
            key={place.id}
            className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            transition={{
              duration: 0.6,
              delay: 0.2,
            }}
          >
            <motion.div
              className="overflow-hidden relative"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={place.main_photo || "/placeholder.svg"}
                alt={place.company}
                className="w-full h-60 object-cover transition-transform duration-300"
              />
              {/* Dark overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-[#424651]/90 text-white p-4">
                <h5 className="text-xl font-semibold">{place.company}</h5>
                <p className="text-gray-300 mt-1 text-sm">
                  {place.sub_description}
                </p>
              </div>
            </motion.div>

            {/* Bottom section */}
            <div className="p-5 bg-[#424651] text-white">
              <div className="mt-4 flex justify-between items-center">
                <h3 className="text-lg font-bold">${place.price}</h3>
                <motion.button
                  onClick={() => navigate(`/PlaceView/${place.id}`)} // Navigate to PlaceView
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Details
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Adventure Travel start */}
      <motion.h1
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-10 mt-10"
      >
        Adventure Travel
      </motion.h1>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {Adventure.map((Adventure, index) => (
          <motion.div
            key={Adventure.id}
            className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            transition={{
              duration: 0.6,
              delay: index * 0.2,
            }}
          >
            <motion.div
              className="overflow-hidden relative"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={Adventure.image || "/placeholder.svg"}
                alt={Adventure.title}
                className="w-full h-60 object-cover transition-transform duration-300"
              />
              {/* Dark overlay with #424651 color */}
              <div className="absolute bottom-0 left-0 right-0 bg-[#424651]/90 text-white p-4">
                <h5 className="text-xl font-semibold">{Adventure.title}</h5>
                <p className="text-gray-300 mt-1 text-sm">
                  {Adventure.description}
                </p>
              </div>
            </motion.div>

            {/* Bottom section with #424651 color */}
            <div className="p-5 bg-[#424651] text-white">
              <div className="mt-4 flex justify-between items-center">
                <h3 className="text-lg font-bold">{Adventure.price}</h3>
                <motion.button
                  onClick={() =>
                    navigate(`/PlaceView/${getTrendingPlace(1).id}`)
                  } // Pass ID to PlaceView
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Buy Now
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
      {/* Adventure Travel end */}

      {/* Hiking & Trekking start */}
      <motion.h1
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-10 mt-10"
      >
        Hiking & Trekking
      </motion.h1>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {Hiking.map((Hiking, index) => (
          <motion.div
            key={Hiking.id}
            className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            transition={{
              duration: 0.6,
              delay: index * 0.2,
            }}
          >
            <motion.div
              className="overflow-hidden relative"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={Hiking.image || "/placeholder.svg"}
                alt={Hiking.title}
                className="w-full h-60 object-cover transition-transform duration-300"
              />
              {/* Dark overlay with #424651 color */}
              <div className="absolute bottom-0 left-0 right-0 bg-[#424651]/90 text-white p-4">
                <h5 className="text-xl font-semibold">{Hiking.title}</h5>
                <p className="text-gray-300 mt-1 text-sm">
                  {Hiking.description}
                </p>
              </div>
            </motion.div>

            {/* Bottom section with #424651 color */}
            <div className="p-5 bg-[#424651] text-white">
              <div className="mt-4 flex justify-between items-center">
                <h3 className="text-lg font-bold">{Hiking.price}</h3>
                <motion.button
                  onClick={() =>
                    navigate(`/PlaceView/${getTrendingPlace(1).id}`)
                  } // Pass ID to PlaceView
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Buy Now
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
      {/* Hiking & Trekking end */}

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
                <img
                  src={GuideImg || "/placeholder.svg"}
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
