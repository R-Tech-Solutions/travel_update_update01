import React, { useState } from "react";
import { useParams } from "react-router-dom";

const Form = () => {
  const { id } = useParams(); // Get the tour ID from URL params
  const [countryCode, setCountryCode] = useState('+94');
  const [phoneNumber, setPhoneNumber] = useState('');

  return (
    <div className="p-20">
      {/* Booking Form Section */}
      <section className="max-w-4xl p-6 mx-auto bg-gray-700 rounded-md shadow-md dark:bg-gray-800 mt-10">
        <h1 className="text-xl font-bold text-white capitalize dark:text-white">
          Book Tour #{id}
        </h1>
        <form className="bg-gray-700 p-6 rounded-lg">
          <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
            <div>
              <label className="text-white" htmlFor="fullName">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                className="block w-full px-4 py-2 mt-2 text-white bg-gray-600 border border-gray-500 rounded-md focus:border-blue-400 focus:outline-none focus:ring"
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
                className="block w-full px-4 py-2 mt-2 text-white bg-gray-600 border border-gray-500 rounded-md focus:border-blue-400 focus:outline-none focus:ring"
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
                  className="block px-3 py-2 text-white bg-gray-600 border border-gray-500 rounded-l-md focus:outline-none focus:ring focus:border-blue-400"
                >
                  <option value="+93">AF +93</option>
                  <option value="+355">AL +355</option>
                  <option value="+213">DZ +213</option>
                  <option value="+1-684	">AS +1-684</option>
                  <option value="+376">AD +376</option>
                  <option value="+244">AO +244</option>
                  <option value="+1-264	">AI +1-264</option>
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
                  className="block w-full px-4 py-2 text-white bg-gray-600 border border-gray-500 rounded-r-md focus:border-blue-400 focus:outline-none focus:ring"
                  placeholder="Enter phone number"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-white" htmlFor="guests">
                Number of Guests
              </label>
              <input
                id="guests"
                type="number"
                min="1"
                defaultValue="2"
                className="block w-full px-4 py-2 mt-2 text-white bg-gray-600 border border-gray-500 rounded-md focus:border-blue-400 focus:outline-none focus:ring"
                required
              />
            </div>

            <div>
              <label className="text-white" htmlFor="date">
                Tour Date
              </label>
              <input
                id="date"
                type="date"
                className="block w-full px-4 py-2 mt-2 text-white bg-gray-600 border border-gray-500 rounded-md focus:border-blue-400 focus:outline-none focus:ring"
                required
              />
            </div>

            <div>
              <label className="text-white" htmlFor="specialRequests">
                Special Requests
              </label>
              <textarea
                id="specialRequests"
                className="block w-full px-4 py-2 mt-2 text-white bg-gray-600 border border-gray-500 rounded-md focus:border-blue-400 focus:outline-none focus:ring"
                rows="3"
              ></textarea>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="px-6 py-2 leading-5 text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
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
