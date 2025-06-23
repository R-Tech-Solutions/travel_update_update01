import React, { useState, useEffect, useLayoutEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { DateRangePicker } from "rsuite";
import { ChevronDown, Minus, Plus, Users } from "lucide-react";
import {BackendUrl} from "../../BackendUrl";


const HotelBookingForm = ({
  adults,
  setAdults,
  childrenAges,
  setChildrenAges,
}) => {
  const [travellingWithPets, setTravellingWithPets] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const incrementCounter = (setter, value) => {
    setter(value + 1);
  };

  const decrementCounter = (setter, value) => {
    if (value > 0) setter(value - 1);
  };

  // Handle children count and ages
  const handleAddChild = () => {
    setChildrenAges([...childrenAges, "Age needed"]);
  };

  const handleRemoveChild = () => {
    if (childrenAges.length > 0) {
      setChildrenAges(childrenAges.slice(0, -1));
    }
  };

  const handleChildAgeChange = (idx, value) => {
    const updatedAges = [...childrenAges];
    updatedAges[idx] = value;
    setChildrenAges(updatedAges);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white mb-6">
      {/* Header Section */}
      <div className="bg-gray-600 px-4 py-3 text-white flex items-center gap-2">
        <Users size={20} />
        <span className="font-medium">
          {adults} adults • {childrenAges.length} child • 1 room
        </span>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="ml-auto focus:outline-none"
          aria-label="Toggle booking form"
        >
          <ChevronDown
            size={16}
            className={`transition-transform ${showForm ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* Form Content - Conditionally Rendered */}
      {showForm && (
        <div className="p-4 space-y-6 bg-gray-700">
          {/* Adults Section */}
          <div className="flex items-center justify-between">
            <span className="text-white font-medium">Adults</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => decrementCounter(setAdults, adults)}
                className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Minus size={16} className="text-white" />
              </button>
              <span className="w-8 text-center font-medium text-white">
                {adults}
              </span>
              <button
                type="button"
                onClick={() => incrementCounter(setAdults, adults)}
                className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Plus size={16} className="text-gray-600" />
              </button>
            </div>
          </div>

          {/* Children Section */}
          <div className="flex items-center justify-between">
            <span className="text-white font-medium">Children</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleRemoveChild}
                className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Minus size={16} className="text-gray-600" />
              </button>
              <span className="w-8 text-center font-medium text-white">
                {childrenAges.length}
              </span>
              <button
                type="button"
                onClick={handleAddChild}
                className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Plus size={16} className="text-gray-600" />
              </button>
            </div>
          </div>
          {/* Children Age Dropdowns */}
          {childrenAges.map((age, idx) => (
            <div className="relative mt-2" key={idx}>
              <select
                value={age}
                onChange={(e) => handleChildAgeChange(idx, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md appearance-none bg-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Age needed">Age needed</option>
                <option value="0">0 years</option>
                <option value="1">01 years</option>
                <option value="2">02 years</option>
                <option value="3">03 years</option>
                <option value="4">04 years</option>
                <option value="5">05 years</option>
                <option value="6">06 years</option>
                <option value="7">07 years</option>
                <option value="8">08 years</option>
                <option value="9">09 years</option>
                <option value="10">10 years</option>
                <option value="11">11 years</option>
                <option value="12">12 years</option>
                <option value="13">13 years</option>
                <option value="14">14 years</option>
                <option value="15">15 years</option>
                <option value="16">16 years</option>
                <option value="17">17 years</option>
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                size={16}
              />
            </div>
          ))}
          {/* Description Text */}

          {/* Done Button */}
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
};

const Form = () => {
  const { id } = useParams();
  const location = useLocation();
  const selectedPlace = location.state?.place;
  
  const [countryCode, setCountryCode] = useState("+94");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [price, setPrice] = useState(selectedPlace?.price || "");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    specialRequests: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Add state for adults, childrenAges to Form and pass them to HotelBookingForm
  const [adults, setAdults] = useState(0);
  const [childrenAges, setChildrenAges] = useState([]);

  // Handle scroll to top on mount and before reload
  useEffect(() => {
    // Function to scroll to top
    const scrollToTop = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    // Scroll to top on mount
    scrollToTop();

    // Handle before unload
    const handleBeforeUnload = () => {
      scrollToTop();
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
    if (!selectedPlace) {
      setLoading(true);
      fetch(`${BackendUrl}/api/places/${id}/`)
        .then((res) => {
          if (!res.ok) throw new Error("Not found");
          return res.json();
        })
        .then((data) => {
          setPrice(data.price);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [id, selectedPlace]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    // Validate form data
    if (!formData.fullName || !formData.email || !arrivalDate || !phoneNumber || adults === 0) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    const bookingData = {
      user_name: formData.fullName,
      email: formData.email,
      phone: `${countryCode}${phoneNumber}`,
      place: id,
      arrival_date: arrivalDate,
      price: totalPrice,
      adults: adults,
      children: childrenAges.length,
      children_ages: childrenAges, // <-- Add this line
      description: formData.specialRequests
    };

    try {
      const response = await fetch(`${BackendUrl}/api/bookings/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create booking');
      }

      setSuccess(true);
      // Reset form
      setFormData({
        fullName: "",
        email: "",
        specialRequests: ""
      });
      setArrivalDate("");
      setPhoneNumber("");
      setAdults(0);
      setChildrenAges([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Calculate total adults, total children, and total price
  const totalAdults = adults;
  const totalChildren = childrenAges.length;
  const freeChildren = childrenAges.filter(
    (age) => Number(age) >= 0 && Number(age) <= 5
  ).length;
  const halfPriceChildren = childrenAges.filter(
    (age) => Number(age) > 5 && Number(age) <= 12
  ).length;
  const fullPriceChildren = childrenAges.filter(
    (age) => Number(age) > 12 && Number(age) <= 17
  ).length;

  // Calculate total price with detailed breakdown
  const basePrice = Number(price) || 0;
  const adultsTotal = totalAdults * basePrice;
  const halfPriceChildrenTotal = halfPriceChildren * (basePrice / 2);
  const fullPriceChildrenTotal = fullPriceChildren * basePrice;
  const totalPrice = adultsTotal + halfPriceChildrenTotal + fullPriceChildrenTotal;

  return (
    <div className="pt-28 p-4 sm:p-8 md:p-12 lg:p-20">
      {/* Add pt-28 to push content below a fixed navbar */}
      {/* Selected Place Details Section */}
      {selectedPlace && (
        <div className="max-w-4xl mx-auto mb-8 bg-gray-700 rounded-lg overflow-hidden shadow-lg">
          <div className="relative h-48 sm:h-56 md:h-64">
            <img
              src={selectedPlace.main_image ? `${BackendUrl}${selectedPlace.main_image}` : "/placeholder.svg"}
              alt={selectedPlace.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">{selectedPlace.title}</h1>
              {selectedPlace.package_title && (
                <p className="text-lg sm:text-xl text-blue-300 mb-2">{selectedPlace.package_title}</p>
              )}
              <div className="flex flex-wrap items-center space-x-2 sm:space-x-4">
                <span className="bg-blue-600 px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm">
                  {selectedPlace.place_type}
                </span>
                <span className="text-xl sm:text-2xl font-bold">${selectedPlace.price}</span>
              </div>
            </div>
          </div>
          <div className="p-4 sm:p-6 bg-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-2">About This Place</h3>
                <p className="text-gray-300 text-sm sm:text-base">{selectedPlace.about_place}</p>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-2">Tour Highlights</h3>
                <p className="text-gray-300 text-sm sm:text-base">{selectedPlace.tour_highlights}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Booking Form Section */}
      <section className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8 bg-gray-700 rounded-md shadow-md dark:bg-gray-800">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">
          Complete Your Booking
        </h2>
        {error && (
          <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-lg text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 text-green-700 bg-green-100 rounded-lg text-sm">
            Booking created successfully!
          </div>
        )}
        <form onSubmit={handleSubmit} className="bg-gray-700 p-0 sm:p-6 rounded-lg">
          {/* Insert HotelBookingForm here */}
          <HotelBookingForm
            adults={adults}
            setAdults={setAdults}
            childrenAges={childrenAges}
            setChildrenAges={setChildrenAges}
          />

          {/* Replace date range with single arrival date */}
          <div className="mt-4">
            <label className="text-white block mb-2 text-sm" htmlFor="arrival-date">
              Arrival Date
            </label>
            <input
              id="arrival-date"
              type="date"
              value={arrivalDate}
              onChange={(e) => setArrivalDate(e.target.value)}
              className="w-full bg-gray-700 border border-gray-500 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:gap-6 mt-4 sm:grid-cols-2">
            <div>
              <label className="text-white text-sm" htmlFor="fullName">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleInputChange}
                className="block w-full px-3 py-2 mt-2 text-white bg-gray-600 border border-gray-500 rounded-md focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                required
              />
            </div>

            <div>
              <label className="text-white text-sm" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="block w-full px-3 py-2 mt-2 text-white bg-gray-600 border border-gray-500 rounded-md focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                required
              />
            </div>

            <div>
              <label className="text-white text-sm" htmlFor="phone">
                Phone Number
              </label>
              <div className="flex mt-2">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="block px-2 py-2 text-white bg-gray-600 border border-gray-500 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="+94">LK +94</option>
                  <option value="+91">IN +91</option>
                  <option value="+1">US +1</option>
                  <option value="+44">UK +44</option>
                  <option value="+61">AU +61</option>
                </select>
                <input
                  id="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="block w-full px-3 py-2 text-white bg-gray-600 border border-gray-500 rounded-r-md focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Enter phone number"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-white text-sm" htmlFor="specialRequests">
                Special Requests
              </label>
              <textarea
                id="specialRequests"
                value={formData.specialRequests}
                onChange={handleInputChange}
                className="block w-full px-3 py-2 mt-2 text-white bg-gray-600 border border-gray-500 rounded-md focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                rows="3"
              ></textarea>
            </div>
          </div>

          <div className="mt-6 space-y-2 text-white">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Price Breakdown</h2>
            
            <div className="flex justify-between items-center text-sm">
              <span>Base Price per Person:</span>
              <span>${basePrice}</span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span>Adults ({totalAdults}):</span>
              <span>${adultsTotal}</span>
            </div>

            {halfPriceChildren > 0 && (
              <div className="flex justify-between items-center text-sm">
                <span>Children Half Price ({halfPriceChildren}):</span>
                <span>${halfPriceChildrenTotal}</span>
              </div>
            )}

            {fullPriceChildren > 0 && (
              <div className="flex justify-between items-center text-sm">
                <span>Children Full Price ({fullPriceChildren}):</span>
                <span>${fullPriceChildrenTotal}</span>
              </div>
            )}

            {freeChildren > 0 && (
              <div className="flex justify-between items-center text-green-400 text-sm">
                <span>Free Children ({freeChildren}):</span>
                <span>Free</span>
              </div>
            )}

            <div className="border-t border-gray-600 pt-2 mt-2">
              <div className="flex justify-between items-center font-bold text-base sm:text-lg">
                <span>Total Price:</span>
                <span>${totalPrice}</span>
              </div>
            </div>

            <p className="text-[11px] sm:text-[12px] text-gray-400 mt-2">
              Note: Children 0-5 years are free, 6-12 years are half price, 13-17 years are full price
            </p>
          </div>

          <div className="flex justify-end mt-6">
            <button
              type="submit"
              disabled={loading}
              className={`px-4 sm:px-6 py-2 leading-5 text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Creating Booking...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Form;

// There is no usage of `activeClassName` in this file.
// The warning is coming from a <NavLink> or <Link> component in your Navbar or another component.
// To fix this, in your Navbar (or wherever you use NavLink), replace:
//   <NavLink to="/somewhere" activeClassName="active">...</NavLink>
// with (for React Router v6+):
//   <NavLink to="/somewhere" className={({ isActive }) => isActive ? "active" : ""}>...</NavLink>