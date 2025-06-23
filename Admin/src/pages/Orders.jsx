import React, { useState, useEffect } from "react";
import { BackendUrl } from "../BackendUrl";

const Orders = () => {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [approvalStatus, setApprovalStatus] = useState(null);
  const [selectedPlaceDetails, setSelectedPlaceDetails] = useState(null);
  

  useEffect(() => {
    window.scrollTo(0, 0); // Always scroll to top on mount
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BackendUrl}/api/bookings/`);
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }
      const data = await response.json();
      // Sort bookings by arrival date
      const sortedBookings = data.sort((a, b) => new Date(a.arrival_date) - new Date(b.arrival_date));
      setBookings(sortedBookings);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (bookingId) => {
    try {
      setApprovalStatus('sending');
      const response = await fetch(`${BackendUrl}/api/bookings/${bookingId}/update/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'approved' })
      });

      if (!response.ok) {
        throw new Error('Failed to approve booking');
      }

      setApprovalStatus('success');
      // Refresh bookings after approval
      fetchBookings();
      
      // Reset approval status after 3 seconds
      setTimeout(() => {
        setApprovalStatus(null);
      }, 3000);
    } catch (err) {
      setError(err.message);
      setApprovalStatus('error');
    }
  };

  const handleView = async (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
    // If place is just an ID, fetch details
    if (booking.place && typeof booking.place === "number") {
      try {
        const res = await fetch(`${BackendUrl}/api/places/${booking.place}/`);
        if (res.ok) {
          const placeData = await res.json();
          setSelectedPlaceDetails(placeData);
        } else {
          setSelectedPlaceDetails(null);
        }
      } catch {
        setSelectedPlaceDetails(null);
      }
    } else {
      setSelectedPlaceDetails(booking.place || null);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
    setSelectedPlaceDetails(null);
  };

  // Format date to be more readable
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (loading) {
    return (
      <div className="p-4 flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Approval Status Message */}
      {approvalStatus && (
        <div className={`mb-4 p-4 rounded-lg ${
          approvalStatus === 'success' 
            ? 'bg-green-100 text-green-700' 
            : approvalStatus === 'error'
            ? 'bg-red-100 text-red-700'
            : 'bg-blue-100 text-blue-700'
        }`}>
          {approvalStatus === 'sending' && 'Sending approval email...'}
          {approvalStatus === 'success' && 'Booking approved and email sent successfully!'}
          {approvalStatus === 'error' && 'Failed to approve booking. Please try again.'}
        </div>
      )}

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-700 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">User Name</th>
              <th scope="col" className="px-6 py-3">Package Details</th>
              <th scope="col" className="px-6 py-3">Contact Info</th>
              <th scope="col" className="px-6 py-3">Arrival Date</th>
              <th scope="col" className="px-6 py-3">Price</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                  {booking.user_name}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {booking.place.title || 'N/A'}
                    </span>
                    {booking.place?.package_title && (
                      <span className="text-sm text-blue-600 dark:text-blue-400">
                        Package: {booking.place.package_title}
                      </span>
                    )}
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Type: {booking.place?.place_type || 'N/A'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-gray-900 dark:text-white">{booking.email}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{booking.phone}</span>
                    {/* Show children ages if available and children > 0 */}
                    {booking.children > 0 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Children Ages: {
                          Array.isArray(booking.children_ages) && booking.children_ages.length > 0
                            ? booking.children_ages
                                .filter(age => age && age !== "Age needed" && age !== "" && age !== null && age !== undefined)
                                .join(", ")
                            : (typeof booking.children_ages === "string" && booking.children_ages.trim() !== "")
                              ? booking.children_ages
                              : "N/A"
                        }
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {formatDate(booking.arrival_date)}
                </td>
                <td className="px-6 py-4">
                  <span className="font-semibold">${booking.price}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    booking.status === 'approved' 
                      ? 'bg-green-100 text-green-800' 
                      : booking.status === 'cancelled'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4 space-x-2">
                  <button
                    onClick={() => handleView(booking)}
                    className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    View
                  </button>
                  {booking.status === 'pending' && (
                    <button
                      onClick={() => handleApprove(booking.id)}
                      className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      Approve
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Enhanced Description Modal */}
      {isModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Booking Details
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Package Details Section */}
              <div className="mt-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-start space-x-4">
                  {selectedPlaceDetails?.main_image && (
                    <img
                      src={`${BackendUrl}${selectedPlaceDetails.main_image}`}
                      alt={selectedPlaceDetails.title}
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {selectedPlaceDetails?.title || 'N/A'}
                    </h4>
                    {selectedPlaceDetails?.package_title && (
                      <p className="text-blue-600 dark:text-blue-400 mt-1 text-lg">
                        Package: {selectedPlaceDetails.package_title}
                      </p>
                    )}
                    <div className="mt-2 flex items-center space-x-4">
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-200">
                        {selectedPlaceDetails?.place_type || 'N/A'}
                      </span>
                      <span className="text-gray-600 dark:text-gray-300">
                        Price: ${selectedBooking.price}
                      </span>
                    </div>

                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Guest Information */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Guest Information
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                      <p className="text-gray-900 dark:text-white font-medium">{selectedBooking.user_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                      <p className="text-gray-900 dark:text-white font-medium">{selectedBooking.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                      <p className="text-gray-900 dark:text-white font-medium">{selectedBooking.phone}</p>
                    </div>
                    {/* Show children ages in modal if available and children > 0 */}
                    {selectedBooking.children > 0 && (
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Children Ages</p>
                        <p className="text-gray-900 dark:text-white font-medium">
                          {
                            Array.isArray(selectedBooking.children_ages) && selectedBooking.children_ages.length > 0
                              ? selectedBooking.children_ages
                                  .filter(age => age && age !== "Age needed" && age !== "" && age !== null && age !== undefined)
                                  .join(", ")
                              : (typeof selectedBooking.children_ages === "string" && selectedBooking.children_ages.trim() !== "")
                                ? selectedBooking.children_ages
                                : "N/A"
                          }
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Booking Details */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Booking Details
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Arrival Date</p>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {formatDate(selectedBooking.arrival_date)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedBooking.status === 'approved' 
                          ? 'bg-green-100 text-green-800' 
                          : selectedBooking.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {selectedBooking.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Total Price</p>
                      <p className="text-gray-900 dark:text-white font-medium">${selectedBooking.price}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Occupancy Details */}
              <div className="mt-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Occupancy Details
                </h4>
                <div className="flex space-x-4">
                  <div className="bg-blue-100 dark:bg-blue-900 px-4 py-2 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-200">Adults</p>
                    <p className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                      {selectedBooking.adults}
                    </p>
                  </div>
                  <div className="bg-purple-100 dark:bg-purple-900 px-4 py-2 rounded-lg">
                    <p className="text-sm text-purple-800 dark:text-purple-200">Children</p>
                    <p className="text-lg font-semibold text-purple-900 dark:text-purple-100">
                      {selectedBooking.children}
                    </p>
                  </div>
                </div>
              </div>

              {/* Special Requests */}
              {selectedBooking.description && (
                <div className="mt-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Special Requests
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {selectedBooking.description}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Close
                </button>
                {selectedBooking.status === 'pending' && (
                  <button
                    onClick={() => {
                      handleApprove(selectedBooking.id);
                      closeModal();
                    }}
                    className={`px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 ${
                      approvalStatus === 'sending' ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={approvalStatus === 'sending'}
                  >
                    {approvalStatus === 'sending' ? 'Sending...' : 'Approve Booking'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;