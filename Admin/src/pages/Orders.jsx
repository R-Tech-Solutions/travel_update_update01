import React, { useState } from "react";

const Orders = () => {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sample booking data with descriptions
  const bookings = [
    {
      id: 1,
      userName: "Mohammed Shinan",
      email: "shinan@example.com",
      phone: "+94771234567",
      startDate: "2023-06-15",
      endDate: "2023-06-20",
      price: "$2999",
      description: "Deluxe sea view room with breakfast included. Special requests: Late checkout requested.",
      adults: 2,
      children: 1,
      rooms: 1
    },
    {
      id: 2,
      userName: "Mohammed Aanish",
      email: "aanish@example.com",
      phone: "+94771234568",
      startDate: "2023-06-18",
      endDate: "2023-06-25",
      price: "$1999",
      description: "Standard room with pool view. No special requests.",
      adults: 1,
      children: 0,
      rooms: 1
    },
    {
      id: 3,
      userName: "Fathima Nihame",
      email: "nihame@example.com",
      phone: "+94771234569",
      startDate: "2023-07-01",
      endDate: "2023-07-07",
      price: "$1599",
      description: "Family suite with connecting rooms. Requested baby crib.",
      adults: 4,
      children: 2,
      rooms: 2
    },
    {
      id: 4,
      userName: "Avihska Fernando",
      email: "avihska@example.com",
      phone: "+94771234570",
      startDate: "2023-07-10",
      endDate: "2023-07-15",
      price: "$2299",
      description: "Executive suite with lounge access. Anniversary celebration.",
      adults: 2,
      children: 0,
      rooms: 1
    },
    {
      id: 5,
      userName: "Iamsha Liyannako",
      email: "iamsha@example.com",
      phone: "+94771234571",
      startDate: "2023-08-05",
      endDate: "2023-08-12",
      price: "$1899",
      description: "Garden view bungalow with private terrace. Vegetarian meal preference.",
      adults: 2,
      children: 1,
      rooms: 1
    }
  ];

  const handleApprove = (bookingId) => {
    console.log(`Approved booking ${bookingId}`);
  };

  const handleView = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  return (
    <div className="p-4">
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-700 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                User Name
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Phone Number
              </th>
              <th scope="col" className="px-6 py-3">
                Dates
              </th>
              <th scope="col" className="px-6 py-3">
                Price
              </th>
              <th scope="col" className="px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {booking.userName}
                </th>
                <td className="px-6 py-4">{booking.email}</td>
                <td className="px-6 py-4">{booking.phone}</td>
                <td className="px-6 py-4">
                  {booking.startDate} to {booking.endDate}
                </td>
                <td className="px-6 py-4">{booking.price}</td>
                <td className="px-6 py-4 space-x-2">
                  <button
                    onClick={() => handleView(booking)}
                    className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleApprove(booking.id)}
                    className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    Approve
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Description Modal */}
      {isModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
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

              <div className="mt-6 space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Guest Information</h4>
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                      <p className="text-gray-700 dark:text-gray-300">{selectedBooking.userName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                      <p className="text-gray-700 dark:text-gray-300">{selectedBooking.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                      <p className="text-gray-700 dark:text-gray-300">{selectedBooking.phone}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Booking Details</h4>
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Check-in</p>
                      <p className="text-gray-700 dark:text-gray-300">{selectedBooking.startDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Check-out</p>
                      <p className="text-gray-700 dark:text-gray-300">{selectedBooking.endDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Total Price</p>
                      <p className="text-gray-700 dark:text-gray-300">{selectedBooking.price}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Occupancy</h4>
                  <div className="mt-2 flex space-x-2">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-200">
                      {selectedBooking.adults} Adults
                    </span>
                    <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-purple-900 dark:text-purple-200">
                      {selectedBooking.children} Children
                    </span>
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-200">
                      {selectedBooking.rooms} Room{selectedBooking.rooms > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Description & Special Requests</h4>
                  <p className="mt-2 text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {selectedBooking.description}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleApprove(selectedBooking.id);
                    closeModal();
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Approve Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;