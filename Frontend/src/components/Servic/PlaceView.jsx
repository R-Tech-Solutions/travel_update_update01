import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PropTypes from 'prop-types';
import { motion, useSpring, useMotionValue } from "framer-motion";
import {BackendUrl} from "../../BackendUrl";

// Cloudinary cloud name must match backend settings
const CLOUDINARY_CLOUD_NAME = "djbf0hou3";

// Helper: get image URL for preview
const getImageUrl = (img) => {
  if (!img) return "/placeholder.svg";

  // Absolute/Cloudinary URL
  if (typeof img === "string" && (img.startsWith("http://") || img.startsWith("https://"))) {
    return img;
  }

  // Object shapes from API or local state
  if (typeof img === "object" && img !== null) {
    if (img instanceof File) return URL.createObjectURL(img);
    if (typeof img.url === "string") return getImageUrl(img.url);
    if (typeof img.image === "string") return getImageUrl(img.image);
    if (img.file instanceof File) return URL.createObjectURL(img.file);
  }

  // Relative path: prefer Django media, else assume Cloudinary path/public_id
  if (typeof img === "string") {
    const cleanPath = img.startsWith('/') ? img.substring(1) : img;
    if (cleanPath.startsWith("media/") || cleanPath.startsWith("static/")) {
      return `${BackendUrl}/${cleanPath}`;
    }
    return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/${cleanPath}`;
  }

  return "/placeholder.svg";
};

// Particle background component
const ParticleBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
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

// Itinerary Item Component
const ItineraryItem = ({ day, sub_iterative_description, sub_description, photos, borderColor }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={`border-l-4 p-4 mb-4 ${borderColor} bg-gray-800 rounded`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left focus:outline-none"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-bold">Day {day}</h3>
            <p className="text-gray-300">{sub_iterative_description}</p>
          </div>
          <span className="text-white">{open ? "−" : "+"}</span>
        </div>
      </button>
      {open && (
        <div className="mt-4 text-sm text-gray-200">
          <div className="grid grid-cols-3 gap-4 mb-4">
            {photos && photos.map((photo, idx) => (
              <img
                key={idx}
                className="w-full h-64 object-cover rounded-lg"
                src={getImageUrl(photo.image)}
                alt={`Day ${day} Photo ${idx + 1}`}
              />
            ))}
          </div>
          <p className="mb-2">{sub_description}</p>
        </div>
      )}
    </div>
  );
};

ItineraryItem.propTypes = {
  day: PropTypes.number.isRequired,
  sub_iterative_description: PropTypes.string.isRequired,
  sub_description: PropTypes.string.isRequired,
  photos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      image: PropTypes.string
    })
  ).isRequired,
  borderColor: PropTypes.string.isRequired
};

const PlaceView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(null);
  const containerRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const scale = useSpring(1, springConfig);
  const rotateX = useSpring(0, springConfig);
  const rotateY = useSpring(0, springConfig);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = (clientX - left) / width;
    const y = (clientY - top) / height;
    
    mouseX.set(clientX);
    mouseY.set(clientY);
    
    rotateX.set((y - 0.5) * 10);
    rotateY.set((x - 0.5) * 10);
    scale.set(1.05);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
  };

  // Handle scroll to top on mount and reload
  useEffect(() => {
    // Function to scroll to top
    const scrollToTop = () => {
      window.scrollTo(0, 0);
    };

    // Scroll to top on mount
    scrollToTop();

    // Handle before unload to ensure scroll position is reset
    const handleBeforeUnload = () => {
      window.scrollTo(0, 0);
    };

    // Add event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('load', scrollToTop);

    // Cleanup
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('load', scrollToTop);
    };
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch(`${BackendUrl}/api/places/${id}/`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        // Map backend fields to frontend model
        const mapped = {
          id: data.id,
          subtitle: data.title,
          place_history: data.subtitle,
          main_image: data.main_image,
          sub_images: data.sub_images || [],
          included: data.include,
          exclude: data.exclude,
          tour_highlights: data.tour_highlights,
          about_place: data.about_place,
          price: data.price,
          package_title: data.package_title,
          price_title: data.price_title,
          itinerary_days: data.itinerary_days || [],
        };
        setPlace(mapped);
        setCurrentImage(data.main_image);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching place:", error);
        setLoading(false);
      });
  }, [id]);

  if (loading) return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-20"
    >
      <div className="inline-block p-8 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
        <motion.div
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-white/80"
        >
          Loading your adventure...
        </motion.div>
      </div>
    </motion.div>
  );
  
  if (!place) return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-20"
    >
      <div className="inline-block p-8 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-white/80"
        >
          Place not found
        </motion.div>
      </div>
    </motion.div>
  );

  return (
    <motion.div 
      ref={containerRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.5, ease: [0.6, -0.05, 0.01, 0.99] }}
      className="flex flex-col items-center w-full mt-20 bg-gradient-to-b from-black via-gray-900 to-black text-white min-h-screen relative"
    >
      <ParticleBackground />
      <div className="w-full max-w-4xl px-4 mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 1 }}
          className="relative pt-5 pb-5 w-full"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl blur-3xl"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <header className="relative w-full">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="text-3xl font-extrabold tracking-tight sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"
            >
              {place.subtitle}
            </motion.h1>
          </header>
        </motion.div>

        {/* Image Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 1.2 }}
          className="flex flex-col gap-8 items-center w-full"
        >
          <motion.div 
            className="flex justify-center w-full relative group"
            style={{
              perspective: "1000px",
              transformStyle: "preserve-3d",
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-2xl group-hover:blur-3xl transition-all duration-500"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.img
              style={{
                rotateX,
                rotateY,
                scale,
                transformStyle: "preserve-3d",
              }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.5 }}
              className="relative rounded-2xl w-full h-auto max-h-[500px] object-cover shadow-2xl border border-white/20 backdrop-blur-sm"
              src={getImageUrl(currentImage)}
              alt="Main View"
            />
          </motion.div>
          <div className="flex justify-center flex-wrap gap-4 w-full">
            {/* Main image thumbnail */}
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="relative group"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-500"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.img
                onClick={() => setCurrentImage(place.main_image)}
                className={`relative w-20 h-20 rounded-xl cursor-pointer object-cover border backdrop-blur-sm ${
                  currentImage === place.main_image
                    ? "border-blue-500"
                    : "border-white/20"
                }`}
                src={getImageUrl(place.main_image)}
                alt="Main Thumbnail"
              />
            </motion.div>
            {/* Sub images thumbnails */}
            {Array.isArray(place.sub_images) &&
              place.sub_images.map((img, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + idx * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative group"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-500"
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <motion.img
                    onClick={() => setCurrentImage(img.image)}
                    className={`relative w-20 h-20 rounded-xl cursor-pointer object-cover border backdrop-blur-sm ${
                      currentImage === img.image
                        ? "border-blue-500"
                        : "border-white/20"
                    }`}
                    src={getImageUrl(img.image)}
                    alt={`Sub ${idx + 1}`}
                  />
                </motion.div>
              ))}
          </div>
        </motion.div>

        {/* Reserve Card Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className="max-w-md w-full rounded-2xl shadow-2xl overflow-hidden mt-20 relative group"
          style={{
            perspective: "1000px",
            transformStyle: "preserve-3d",
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-2xl group-hover:blur-3xl transition-all duration-500"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            style={{
              rotateX,
              rotateY,
              scale,
              transformStyle: "preserve-3d",
            }}
            className="relative p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl"
          >
            {place.package_title && (
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="text-lg font-semibold text-blue-300 mb-2"
              >
                {place.package_title}
              </motion.h3>
            )}
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 }}
              className="text-xl font-bold text-white mb-2"
            >
              {place.price_title}
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
              className="space-y-3 mb-6"
            >
              <div className="flex justify-between">
                <span className="text-white">Price</span>
                <span className="font-semibold text-white">Total : ${place.price}</span>
              </div>
              <span className="font-semibold text-white">{place.place_history}</span>
              <p className="text-sm text-white/80">
                (Price includes taxes and booking fees)
              </p>
            </motion.div>
            
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              whileHover={{ 
                scale: 1.02, 
                boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
                textShadow: "0 0 8px rgba(255, 255, 255, 0.5)"
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/Forms/${place.id}`)}
              className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold py-3 px-4 rounded-xl transition duration-200 shadow-lg"
            >
              Reserve Now
            </motion.button>
          </motion.div>
        </motion.div>

        {/* About Section */}
        <motion.main 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="py-8 w-full relative group"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl blur-2xl group-hover:blur-3xl transition-all duration-500"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <div className="relative p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 }}
              className="text-xl font-bold mb-4 text-white"
            >
              About This Tour
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
              className="text-gray-300"
            >
              {place.about_place}
            </motion.p>
          </div>
        </motion.main>

        {/* Highlights Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 1 }}
          className="rounded-2xl p-8 mb-8 w-full relative group"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl blur-2xl group-hover:blur-3xl transition-all duration-500"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <div className="relative p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              className="text-2xl font-bold text-white mb-6"
            >
              TOUR HIGHLIGHTS
            </motion.h2>
            {(() => {
              let highlights = place.tour_highlights;
              if (typeof highlights === "string" && highlights.trim().startsWith("[")) {
                try {
                  highlights = JSON.parse(highlights);
                } catch (error) {
                  console.error("Error parsing highlights:", error);
                }
              }
              return Array.isArray(highlights) ? (
                <ul className="space-y-2 list-disc pl-5">
                  {highlights.map((item, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.6 + idx * 0.1 }}
                      className="text-gray-300"
                    >
                      {item}
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-300">{highlights}</p>
              );
            })()}
          </div>
        </motion.div>

        {/* Itinerary Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 1 }}
          className="w-full mb-10 relative group"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl blur-2xl group-hover:blur-3xl transition-all duration-500"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <div className="relative p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.7 }}
              className="text-3xl font-bold text-white mb-6"
            >
              Tour Itinerary
            </motion.h2>
            {place.itinerary_days && place.itinerary_days.length > 0 ? (
              place.itinerary_days.map((day, idx) => (
                <motion.div
                  key={day.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.8 + idx * 0.1 }}
                >
                  <ItineraryItem
                    day={day.day}
                    sub_iterative_description={day.sub_iterative_description}
                    sub_description={day.sub_description}
                    photos={day.photos}
                    borderColor={idx % 2 === 0 ? "border-green-500" : "border-blue-500"}
                  />
                </motion.div>
              ))
            ) : (
              <p className="text-gray-300">No itinerary data available</p>
            )}
          </div>
        </motion.div>

        {/* Included-Excluded Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 1 }}
          className="w-full mb-20 relative group"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl blur-2xl group-hover:blur-3xl transition-all duration-500"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <div className="relative p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.9 }}
              className="text-3xl font-bold text-white mb-6"
            >
              What&apos;s Included & Excluded
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2 }}
                  className="text-xl font-semibold mb-4 text-white"
                >
                  Included
                </motion.h3>
                {(() => {
                  let included = place.included;
                  if (typeof included === "string" && included.trim().startsWith("[")) {
                    try {
                      included = JSON.parse(included);
                    } catch (error) {
                      console.error("Error parsing included items:", error);
                    }
                  }
                  return Array.isArray(included) ? (
                    <ul className="list-disc pl-5 space-y-2 text-gray-300">
                      {included.map((item, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 2.1 + idx * 0.1 }}
                        >
                          {item}
                        </motion.li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-300">{included}</p>
                  );
                })()}
              </div>
              <div>
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2 }}
                  className="text-xl font-semibold mb-4 text-white"
                >
                  Excluded
                </motion.h3>
                {(() => {
                  let excluded = place.exclude;
                  if (typeof excluded === "string" && excluded.trim().startsWith("[")) {
                    try {
                      excluded = JSON.parse(excluded);
                    } catch (error) {
                      console.error("Error parsing excluded items:", error);
                    }
                  }
                  return Array.isArray(excluded) ? (
                    <ul className="list-disc pl-5 space-y-2 text-gray-300">
                      {excluded.map((item, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 2.1 + idx * 0.1 }}
                        >
                          {item}
                        </motion.li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-300">{excluded}</p>
                  );
                })()}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PlaceView;
