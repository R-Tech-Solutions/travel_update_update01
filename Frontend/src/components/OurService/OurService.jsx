"use client";

import { useState, useEffect } from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
} from "lucide-react";
import { Calendar, Headphones, Heart, HeartPulse, Wallet } from "lucide-react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import axios from "axios";
import "./OurService.css";

// Animation variants
const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

// Icon mapping for exactly five services
const iconMap = {
  1: <Heart className="h-10 w-10" />,
  2: <Calendar className="h-10 w-10" />,
  3: <Wallet className="h-10 w-10" />,
  4: <Headphones className="h-10 w-10" />,
  5: <HeartPulse className="h-10 w-10" />,
};

export default function ContactSection({ onOrderClick }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch services from the backend
  useEffect(() => {
    const fetchServices = async () => {
      try {
        // Fix: Use correct API endpoint (should be /api/services/, not /services/)
        const response = await axios.get("http://127.0.0.1:8000/api/services/");
        setServices(response.data.slice(0, 5));
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch services: " + (err.response?.status || err.message));
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Fallback for missing services to always show 5 cards
  const fallbackServices = [
    {
      service_title: "Personalized Vacation Planning",
      service_description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad ut aperiam mollitia officia, natus eligendi. Magnam assumenda incidunt magni impedit.",
    },
    {
      service_title: "Custom Itinerary Planning",
      service_description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad ut aperiam mollitia officia, natus eligendi. Magnam assumenda incidunt magni impedit.",
    },
    {
      service_title: "Price Monitoring",
      service_description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad ut aperiam mollitia officia, natus eligendi. Magnam assumenda incidunt magni impedit.",
    },
    {
      service_title: "Top-Rated Travel Advisors",
      service_description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad ut aperiam mollitia officia, natus eligendi. Magnam assumenda incidunt magni impedit.",
    },
    {
      service_title: "Wedding & Honeymoon Planning",
      service_description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad ut aperiam mollitia officia, natus eligendi. Magnam assumenda incidunt magni impedit.",
    },
  ];

  // Merge backend services with fallback to always have 5
  const mergedServices = [...services, ...fallbackServices].slice(0, 5);

  return (
    <section className="relative w-full min-h-screen bg-gradient-to-br from-black via-black to-blue-900 overflow-hidden">
      {/* Blue blurred circle background effect */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600 opacity-40 blur-[180px]" />
      {/* Service Cards Section */}
      <div className="relative z-10 mx-auto max-w-7xl px-2 sm:px-4 py-8 sm:py-12">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="my-8 border-l-8 border-/50 py-2 pl-2 ml-2 sm:ml-10 text-2xl sm:text-3xl font-bold text-white"
        >
          Our Services
        </motion.h1>

        {loading ? (
          <p>Loading services...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-wrap justify-center gap-4 sm:gap-5 p-2 sm:p-5 sm:mr-20"
          >
            {mergedServices.map((service, index) => (
              <motion.div key={index} variants={item}>
                <ServiceCard
                  icon={iconMap[index + 1]}
                  title={service.service_title}
                  description={service.service_description}
                  additionalText=""
                  onOrderClick={onOrderClick}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>



      {/* Google Maps */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="w-full"
      >
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.5587331315046!2d80.62909987581918!3d7.290940113767937!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae369997f1ed09f%3A0xc481c1ae9def464!2sKandy%20town%20stay!5e0!3m2!1sen!2slk!4v1740126533017!5m2!1sen!2slk"
          width="100%"
          height="250"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full sm:h-[350px] md:h-[450px]"
        ></iframe>
      </motion.div>

      {/* Social Media Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="py-6 sm:py-8 text-center"
      >
        <h3 className="mb-4 text-base font-semibold sm:text-lg md:text-xl">Follow Us</h3>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="social-icons"
        >
          <motion.div variants={item}>
            <SocialIcon icon={<Facebook className="h-6 w-6" />} type="facebook" />
          </motion.div>
          <motion.div variants={item}>
            <SocialIcon icon={<Twitter className="h-6 w-6" />} type="twitter" />
          </motion.div>
          <motion.div variants={item}>
            <SocialIcon icon={<Instagram className="h-6 w-6" />} type="instagram" />
          </motion.div>
          <motion.div variants={item}>
            <SocialIcon icon={<Linkedin className="h-6 w-6" />} type="linkedin" />
          </motion.div>
          <motion.div variants={item}>
            <SocialIcon icon={<Youtube className="h-6 w-6" />} type="youtube" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function ContactInfoCard({ icon, title, text }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="rounded-lg bg-black p-4 text-white shadow-md transition-transform"
    >
      <span className="mb-3 block sm:mb-4">{icon}</span>
      <span className="block text-base font-medium sm:text-lg">{title}</span>
      <span className="mt-1 block text-sm opacity-90 sm:mt-2 sm:text-base">
        {text}
      </span>
    </motion.div>
  );
}

ContactInfoCard.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

function SocialIcon({ icon, type }) {
  return (
    <button
      className="social-icon-btn"
      aria-label={`Visit our ${type} page`}
    >
      <span className={`social-icon-btn__back ${type}-gradient`}></span>
      <span className="social-icon-btn__front">
        <span className="social-icon-btn__icon" aria-hidden="true">
          {icon}
        </span>
      </span>
    </button>
  );
}

SocialIcon.propTypes = {
  icon: PropTypes.node.isRequired,
  type: PropTypes.string.isRequired
};

function ServiceCard({ icon, title, description, additionalText, onOrderClick }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      className={`relative flex w-[280px] h-[380px] flex-col items-center justify-center overflow-hidden rounded-[30px] bg-gray-300 p-6 text-gray-800 cursor-pointer transition-colors duration-500 ${
        isHovered ? "text-white" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onOrderClick}
    >
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: isHovered ? "100%" : 0 }}
        className={`absolute bottom-0 right-0 w-full rounded-[30px] bg-gray-600 transition-all duration-700 ease-in-out`}
      />
      <div
        className={`mb-10 relative z-10 transition-colors duration-500 ${
          isHovered ? "text-white" : ""
        }`}
      >
        {icon}
      </div>
      <div className="relative z-10 text-center px-4">
        <h3
          className={`mb-4 text-xl font-bold transition-colors duration-500 line-clamp-2 ${
            isHovered ? "text-white" : "text-black"
          }`}
        >
          {title}
        </h3>
        <p className="mb-3 text-sm line-clamp-4 h-[80px]">{description}</p>
        <p className="text-sm line-clamp-2 h-[40px]">{additionalText}</p>
      </div>
    </motion.div>
  );
}

ServiceCard.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  additionalText: PropTypes.string.isRequired,
  onOrderClick: PropTypes.func.isRequired
};

ContactSection.propTypes = {
  onOrderClick: PropTypes.func.isRequired
};

// ContactCard component
function ContactCard({ icon, title, value }) {
  return (
    <div className="w-[100px] hover:scale-[1.1] h-[125px] sm:w-[200px] sm:h-[225px] gap-1 md:gap-4 flex flex-col px-2 py-3 justify-center items-center bg-white bg-opacity-30 rounded-[25px] transition-transform duration-300">
      {icon}
      <h3 className="text-base capitalize font-black text-white sm:text-[28px]">{title}</h3>
      <p className="text-sm text-center font-regular text-[#A4A4A5] sm:text-xl">{value}</p>
    </div>
  );
}

ContactCard.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.node.isRequired
};