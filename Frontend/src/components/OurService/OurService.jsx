"use client";

import React, { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
} from "lucide-react";
import { Calendar, Headphones, Heart, HeartPulse, Wallet } from "lucide-react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

// Animation variants
const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } }
};

export default function ContactSection() {
  return (
    <section className="w-full">
      {/* Service Cards Section */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="my-8 border-l-8 border-/50 py-2 pl-2 ml-10 text-3xl font-bold"
        >
          Our Services
        </motion.h1>
        
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-wrap justify-center gap-5 p-5 mr-20"
        >
          <motion.div variants={item}>
            <ServiceCard
              icon={<Heart className="h-10 w-10" />}
              title="Personalized Vacation Planning"
              description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad ut aperiam mollitia officia, natus eligendi. Magnam assumenda incidunt magni impedit."
              additionalText="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tempore ratione obcaecati nemo architecto nulla? Praesentium ducimus illo aliquam dolorum id."
            />
          </motion.div>

          <motion.div variants={item}>
            <ServiceCard
              icon={<Calendar className="h-10 w-10" />}
              title="Custom Itinerary Planning"
              description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad ut aperiam mollitia officia, natus eligendi. Magnam assumenda incidunt magni impedit."
              additionalText="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tempore ratione obcaecati nemo architecto nulla? Praesentium ducimus illo aliquam dolorum id."
            />
          </motion.div>

          <motion.div variants={item}>
            <ServiceCard
              icon={<Wallet className="h-10 w-10" />}
              title="Price Monitoring"
              description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad ut aperiam mollitia officia, natus eligendi. Magnam assumenda incidunt magni impedit."
              additionalText="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tempore ratione obcaecati nemo architecto nulla? Praesentium ducimus illo aliquam dolorum id."
            />
          </motion.div>

          <motion.div variants={item}>
            <ServiceCard
              icon={<Headphones className="h-10 w-10" />}
              title="Top-Rated Travel Advisors"
              description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad ut aperiam mollitia officia, natus eligendi. Magnam assumenda incidunt magni impedit."
              additionalText="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tempore ratione obcaecati nemo architecto nulla? Praesentium ducimus illo aliquam dolorum id."
            />
          </motion.div>

          <motion.div variants={item}>
            <ServiceCard
              icon={<HeartPulse className="h-10 w-10" />}
              title="Wedding & Honeymoon Planning"
              description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad ut aperiam mollitia officia, natus eligendi. Magnam assumenda incidunt magni impedit."
              additionalText="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tempore ratione obcaecati nemo architecto nulla? Praesentium ducimus illo aliquam dolorum id."
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Hero Section with Gradient Background */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="relative flex h-[40vh] flex-col items-center justify-center bg-gradient-to-b from-black/50 to-black/80 bg-[url('/placeholder.svg?height=600&width=1200')] bg-cover bg-fixed bg-center bg-no-repeat px-4 text-center text-white"
      >
        <h2 className="my-8 border-l-8 border-/50 py-2 pl-2 ml-10 text-3xl font-bold">
          contact us
        </h2>
        <div className="my-4 flex items-center">
          <div className="h-[3px] w-[20px] rounded-md bg-white sm:w-[70px]"></div>
          <div className="mx-1 h-[10px] w-[10px] rounded-full bg-white"></div>
          <div className="h-[3px] w-[50px] rounded-md bg-white sm:w-[70px]"></div>
        </div>
        <p className="mx-auto max-w-xs text-sm opacity-90 sm:max-w-md sm:text-base md:max-w-2xl md:text-lg">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Assumenda
          iste facilis quos impedit fuga nobis modi debitis laboriosam velit
          reiciendis quisquam alias corporis.
        </p>
      </motion.div>

      {/* Simplified Contact Information Cards */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 gap-4 text-center sm:gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {/* Phone */}
          <motion.div variants={item} className="flex flex-col items-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center text-blue-600 dark:text-blue-400">
              <Phone className="h-6 w-6 sm:h-7 sm:w-7" />
            </div>
            <h3 className="mb-1 text-lg font-medium">Phone No.</h3>
            <p className="text-gray-600 dark:text-gray-300">1-2392-23928-2</p>
          </motion.div>

          {/* Email */}
          <motion.div variants={item} className="flex flex-col items-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center text-blue-600 dark:text-blue-400">
              <Mail className="h-6 w-6 sm:h-7 sm:w-7" />
            </div>
            <h3 className="mb-1 text-lg font-medium">E-mail</h3>
            <p className="text-gray-600 dark:text-gray-300">mail@company.com</p>
          </motion.div>

          {/* Address */}
          <motion.div variants={item} className="flex flex-col items-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center text-blue-600 dark:text-blue-400">
              <MapPin className="h-6 w-6 sm:h-7 sm:w-7" />
            </div>
            <h3 className="mb-1 text-lg font-medium">Address</h3>
            <p className="text-gray-600 dark:text-gray-300">
              2939 Patrick Street, Victoria TX
            </p>
          </motion.div>

          {/* Hours */}
          <motion.div variants={item} className="flex flex-col items-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center text-blue-600 dark:text-blue-400">
              <Clock className="h-6 w-6 sm:h-7 sm:w-7" />
            </div>
            <h3 className="mb-1 text-lg font-medium">Opening Hours</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Mon-Fri (9:00 AM to 5:00 PM)
            </p>
          </motion.div>
        </motion.div>
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
          height="350"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="sm:h-[450px]"
        ></iframe>
      </motion.div>

      {/* Social Media Footer */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="py-8 text-center sm:py-10"
      >
        <h3 className="mb-4 text-lg font-semibold sm:text-xl">Follow Us</h3>
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex justify-center space-x-3 sm:space-x-4"
        >
          <motion.div variants={item}>
            <SocialIcon icon={<Facebook className="h-4 w-4 sm:h-5 sm:w-5" />} />
          </motion.div>
          <motion.div variants={item}>
            <SocialIcon icon={<Twitter className="h-4 w-4 sm:h-5 sm:w-5" />} />
          </motion.div>
          <motion.div variants={item}>
            <SocialIcon icon={<Instagram className="h-4 w-4 sm:h-5 sm:w-5" />} />
          </motion.div>
          <motion.div variants={item}>
            <SocialIcon icon={<Linkedin className="h-4 w-4 sm:h-5 sm:w-5" />} />
          </motion.div>
          <motion.div variants={item}>
            <SocialIcon icon={<Youtube className="h-4 w-4 sm:h-5 sm:w-5" />} />
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

function SocialIcon({ icon }) {
  return (
    <motion.a
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      href="#"
      className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white transition-colors hover:bg-gray-800 sm:h-10 sm:w-10"
    >
      {icon}
    </motion.a>
  );
}

SocialIcon.propTypes = {
  icon: PropTypes.node.isRequired,
};

function ServiceCard({ icon, title, description, additionalText }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      className={`relative flex w-[275px] h-[400px] flex-col items-center justify-center overflow-hidden rounded-[40px] bg-gray-300 p-6 text-gray-800 cursor-pointer transition-colors duration-500 ${
        isHovered ? "text-white" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background overlay that animates on hover */}
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: isHovered ? "100%" : 0 }}
        className={`absolute bottom-0 right-0 w-full rounded-[40px] bg-gray-600 transition-all duration-700 ease-in-out`}
      />

      {/* Icon */}
      <div
        className={`mb-12 relative z-10 transition-colors duration-500 ${
          isHovered ? "text-white" : ""
        }`}
      >
        {icon}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center">
        <h3
          className={`mb-2 text-xl font-semibold transition-colors duration-500 ${
            isHovered ? "text-white" : "text-black"
          }`}
        >
          {title}
        </h3>
        <p className="mb-2 text-sm">{description}</p>
        <p className="text-sm">{additionalText}</p>
      </div>
    </motion.div>
  );
}

ServiceCard.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  additionalText: PropTypes.string.isRequired,
};