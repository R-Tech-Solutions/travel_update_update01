import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import Product1 from "../../assets/plc/img1.jpg";
import Product2 from "../../assets/plc/img2.jpg";
import Product3 from "../../assets/plc/img3.jpg";
import Product4 from "../../assets/plc/img4.jpg";
import thumbnail1 from "../../assets/plc/img5.jpg";
import thumbnail2 from "../../assets/plc/img6.jpg";
import thumbnail3 from "../../assets/plc/img7.jpg";
import thumbnail4 from "../../assets/plc/img8.jpg";
import ScrollToTop from "react-scroll-to-top";

const ImageSelector = ({ lightbox }) => {
  const [currentSlide, setCurrentSlide] = useState(Product1);
  const navigate = useNavigate();
  const { id } = useParams();

  // Sample tour data - in a real app, this would come from an API
  const tourData = {
    id: id || "5-day-sri-lanka",
    title: "5 Days Tour in Sri Lanka (Hotels with Breakfast & Luxury Car)",
    pricePerAdult: 460.00,
    pickupIncluded: true,
    duration: "5 days",
    description: "Experience the best of Sri Lanka in this 5-day luxury tour package. Visit cultural landmarks, enjoy beautiful landscapes, and relax in premium accommodations.",
    highlights: [
      "Luxury accommodations with breakfast",
      "Private air-conditioned vehicle",
      "Professional tour guide",
      "All entrance fees included",
      "Small group experience",
      "Flexible itinerary"
    ],
    included: [
      "Accommodation",
      "Daily breakfast",
      "Transport with air-conditioning",
      "Tour guide",
      "Airport transfers",
      "Entrance fees"
    ],
    excluded: [
      "International airfare",
      "Visa fees",
      "Travel insurance",
      "Personal expenses",
      "Optional excursions"
    ]
  };

  const handleLightBox = () => {
    if (lightbox) {
      lightbox();
    }
  };

  const handleChangeImage = (image) => {
    setCurrentSlide(image);
  };

  const handleReserveClick = () => {
    navigate(`/Forms/${tourData.id}`);
  };

  const BulletPoint = () => (
    <svg
      className="flex-shrink-0 mr-2 mt-1"
      width="6"
      height="6"
      viewBox="0 0 6 6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="3" cy="3" r="3" fill="#FFFFFF" />
    </svg>
  );

  const itineraryData = [
    {
      day: "Day 01",
      title: "AIRPORT | KANDY (APPROX. TRAVEL TIME 3.5 HRS)",
      borderColor: "border-green-500",
      content: (
        <>
          <div className="flex space-x-4 mb-4">
            <img
              className="w-64 h-96 object-cover rounded-lg"
              src={thumbnail3}
              alt="Elephants bathing in river near Kandy"
            />
            <img
              className="w-64 h-96 object-cover rounded-lg"
              src={thumbnail3}
              alt="Elephants bathing in river near Kandy"
            />
          </div>
          <p className="mb-2">
            Upon arriving in Sri Lanka, transfer direct to Hill Capital Kandy.
          </p>
          <div className="bg-green-100 text-green-800 p-4 rounded">
            <p>
              En-route visit the Pinnawala Elephant Orphanage. Relax by the
              poolside. Overnight stay in Kandy.
            </p>
          </div>
        </>
      ),
    },
    {
      day: "Day 02",
      title: "KANDY | SIGHTSEEING",
      borderColor: "border-blue-500",
      content: (
        <>
          <img
            className="w-full max-w-md rounded-lg mb-4"
            src={thumbnail2}
            alt="Temple of the Tooth in Kandy"
          />
          <p>
            Visit the Temple of the Tooth Relic. Explore the Royal Botanical
            Gardens.
          </p>
        </>
      ),
    },
    {
      day: "Day 03",
      title: "KANDY | NUWARA ELIYA",
      borderColor: "border-blue-500",
      content: (
        <>
          <img
            className="w-full max-w-md rounded-lg mb-4"
            src={thumbnail1}
            alt="Tea plantations in Nuwara Eliya"
          />
          <p>
            Travel to Nuwara Eliya. Visit tea plantations. Enjoy the cool
            climate.
          </p>
        </>
      ),
    },
    {
      day: "Day 04",
      title: "NUWARA ELIYA | BENTOTA (APPROX. TRAVEL TIME 4 HRS)",
      borderColor: "border-blue-500",
      content: (
        <>
          <img
            className="w-full max-w-md rounded-lg mb-4"
            src={thumbnail4}
            alt="Beach in Bentota"
          />
          <p>
            Travel to the coastal town of Bentota. Enjoy water sports or relax
            on beaches.
          </p>
        </>
      ),
    },
    {
      day: "Day 05",
      title: "BENTOTA | DEPARTURE",
      borderColor: "border-blue-500",
      content: (
        <>
          <img
            className="w-full max-w-md rounded-lg mb-4"
            src={Product4}
            alt="Sunset in Bentota"
          />
          <p>
            Free time until transfer to the airport for your departure flight.
          </p>
        </>
      ),
    },
  ];

  const ItineraryItem = ({ day, title, content, borderColor }) => {
    const [open, setOpen] = useState(false);

    return (
      <div className={`border-l-4 p-4 mb-4 ${borderColor} bg-gray-800 rounded`}>
        <button
          onClick={() => setOpen(!open)}
          className="w-full text-left focus:outline-none"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-bold">{day}</h3>
              <p className="text-gray-300">{title}</p>
            </div>
            <span className="text-white">{open ? "−" : "+"}</span>
          </div>
        </button>
        {open && <div className="mt-4 text-sm text-gray-200">{content}</div>}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center w-full mt-20 bg-black text-white">
      <div className="w-full max-w-4xl px-4 mx-auto">
        {/* Header */}
        <div className="relative pt-5 pb-5 w-full">
          <header className="w-full">
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              {tourData.title}
            </h1>
            <p className="mt-2 text-sm font-semibold text-gray-300">
              {tourData.duration} tour package
            </p>
          </header>
        </div>

        {/* Image Section */}
        <div className="flex flex-col gap-8 items-center w-full">
          <div
            onClick={handleLightBox}
            className="cursor-pointer flex justify-center w-full"
          >
            <img
              className="rounded-xl w-full h-auto max-h-[500px] object-cover shadow-2xl"
              src={currentSlide}
              alt="Main View"
            />
          </div>
          <div className="flex justify-center flex-wrap gap-4 w-full">
            {[thumbnail1, thumbnail2, thumbnail3, thumbnail4].map(
              (thumb, idx) => (
                <img
                  key={idx}
                  onClick={() =>
                    handleChangeImage(
                      [Product1, Product2, Product3, Product4][idx]
                    )
                  }
                  className="hover:opacity-70 w-20 h-20 rounded-lg cursor-pointer object-cover border border-orange-400"
                  src={thumb}
                  alt={`Thumbnail ${idx + 1}`}
                />
              )
            )}
          </div>
        </div>

        {/* Reserve Card Section */}
        <div className="max-w-md w-full rounded-lg shadow-md overflow-hidden border-2 border-white mt-20 bg-gray-900">
          <div className="p-6">
            <h2 className="text-xl font-bold text-white mb-2">{tourData.title}</h2>
            
            {tourData.pickupIncluded && (
              <div className="flex items-center mb-4">
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Pickup included
                </span>
              </div>
            )}
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-white">2 Adults x ${tourData.pricePerAdult.toFixed(2)}</span>
                <span className="font-semibold text-white">
                  Total ${(2 * tourData.pricePerAdult).toFixed(2)}
                </span>
              </div>
              <p className="text-sm text-white">(Price includes taxes and booking fees)</p>
            </div>
            
            <button 
              onClick={handleReserveClick}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
            >
              Reserve Now
            </button>
          </div>
        </div>

        {/* About Section */}
        <main className="py-8 w-full">
          <h2 className="text-xl font-bold mb-4 text-white">About This Tour</h2>
          <p className="text-gray-300">
            {tourData.description}
          </p>
        </main>

        {/* Highlights Section */}
        <div className="rounded-lg p-6 mb-8 w-full bg-gray-900">
          <h2 className="text-2xl font-bold text-white mb-6">TOUR HIGHLIGHTS</h2>
          <ul className="space-y-3">
            {tourData.highlights.map((text, index) => (
              <li key={index} className="flex items-start">
                <BulletPoint />
                <span className="text-gray-300">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Itinerary Section */}
        <div className="bg-gray-900 w-full mb-10 p-6 rounded-lg">
          <h2 className="text-3xl font-bold text-white mb-6">Tour Itinerary</h2>
          {itineraryData.map((item, idx) => (
            <ItineraryItem key={idx} {...item} />
          ))}
        </div>

        {/* Included-Excluded Section */}
        <div className="w-full mb-20 bg-gray-900 p-6 rounded-lg">
          <h2 className="text-3xl font-bold text-white mb-6">
            What's Included & Excluded
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-white">
                Included
              </h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-300">
                {tourData.included.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-white">
                Excluded
              </h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-300">
                {tourData.excluded.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <ScrollToTop smooth color="#fff" style={{ backgroundColor: "#3b82f6" }} />
    </div>
  );
};

ImageSelector.propTypes = {
  lightbox: PropTypes.func,
};

export default ImageSelector;