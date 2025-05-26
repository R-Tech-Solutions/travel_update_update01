import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { DateRangePicker } from "rsuite";
import { ChevronDown, Minus, Plus, Users } from "lucide-react";

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
  const [countryCode, setCountryCode] = useState("+94");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [price, setPrice] = useState(""); // Add price state
  const [loading, setLoading] = useState(false);

  // Add state for adults, childrenAges to Form and pass them to HotelBookingForm
  const [adults, setAdults] = useState(0);
  const [childrenAges, setChildrenAges] = useState([]);

  useEffect(() => {
    setLoading(true);
    fetch(`http://127.0.0.1:8000/api/places/${id}/`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        setPrice(data.price);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  // Calculate days between start and end date
  const getDays = () => {
    if (!dateRange.start || !dateRange.end) return 0;
    const start = new Date(dateRange.start);
    const end = new Date(dateRange.end);
    const diff = (end - start) / (1000 * 60 * 60 * 24);
    return diff > 0 ? diff : 0;
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

  // Calculate total price
  const basePrice = Number(price) || 0;
  const totalPrice =
    totalAdults * basePrice +
    halfPriceChildren * (basePrice / 2) +
    fullPriceChildren * basePrice;

  return (
    <div className="p-20">
      {/* Booking Form Section */}
      <section className="max-w-4xl p-6 mx-auto bg-gray-700 rounded-md shadow-md dark:bg-gray-800 mt-10">
        <h1 className="text-xl font-bold text-white capitalize dark:text-white">
          Book Tour #{id}
        </h1>
        <form className="bg-gray-700 p-6 rounded-lg">
          {/* Add a text box above the date range picker */}

          {/* Insert HotelBookingForm here */}
          <HotelBookingForm
            adults={adults}
            setAdults={setAdults}
            childrenAges={childrenAges}
            setChildrenAges={setChildrenAges}
          />

          <div className="flex items-center gap-2 bg-gray-700 p-2 rounded-md">
            <input
              id="datepicker-range-start"
              name="start"
              type="date"
              value={dateRange.start}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, start: e.target.value }))
              }
              className="flex-1 bg-gray-700 border border-gray-500 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2 focus:outline-none"
            />
            <span className="mx-2 text-gray-300">to</span>
            <input
              id="datepicker-range-end"
              name="end"
              type="date"
              value={dateRange.end}
              min={dateRange.start}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, end: e.target.value }))
              }
              className="flex-1 bg-gray-700 border border-gray-500 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
            <div>
              <label className="text-white" htmlFor="fullName">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                className="block w-full px-4 py-2 mt-2 text-white bg-gray-600 border border-gray-500 rounded-md focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="text-white" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className="block w-full px-4 py-2 mt-2 text-white bg-gray-600 border border-gray-500 rounded-md focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="text-white" htmlFor="phone">
                Phone Number
              </label>
              <div className="flex mt-2">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="block px-3 py-2 text-white bg-gray-600 border border-gray-500 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="+93">AF +93</option>
                  <option value="+355">AL +355</option>
                  <option value="+213">DZ +213</option>
                  <option value="+1-684">AS +1-684</option>
                  <option value="+376">AD +376</option>
                  <option value="+244">AO +244</option>
                  <option value="+1-264">AI +1-264</option>
                  <option value="+672">AQ +672</option>
                  <option value="+1-268">AG +1-268</option>
                  <option value="+54">AR +54</option>
                  <option value="+374">AM +374</option>
                  <option value="+297">AW +297</option>
                  <option value="+61">AU +61</option>
                </select>
                <input
                  id="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="block w-full px-4 py-2 text-white bg-gray-600 border border-gray-500 rounded-r-md focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter phone number"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-white" htmlFor="specialRequests">
                Special Requests
              </label>
              <textarea
                id="specialRequests"
                className="block w-full px-4 py-2 mt-2 text-white bg-gray-600 border border-gray-500 rounded-md focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
              ></textarea>
            </div>
          </div>

          <h1>price : {loading ? "Loading..." : price}</h1>
          <h1>Days : {getDays()}</h1>
          <h1>Total Adults : {totalAdults}</h1>
          <p className="text-[12px]">from age 0-5 free, 6-12 half price, 13-17 full price</p>
          <h1>
            Total Childs : {totalChildren} (Free: {freeChildren}, Half: {halfPriceChildren}, Full: {fullPriceChildren})
          </h1>
          <h1>Total Price : {isNaN(totalPrice) ? "" : totalPrice}</h1>

          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="px-6 py-2 leading-5 text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            >
              Confirm Booking
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