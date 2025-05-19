import React from "react";

const RecentOrder = () => {
  // Data for the table
  const places = [
    {
      id: 1,
      name: "New York",
      country: "United States",
      image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80",
      district: "Manhattan",
      districtCode: "NY",
      days: 7,
      price: 599
    },
    {
      id: 2,
      name: "London",
      country: "United Kingdom",
      image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80",
      district: "Westminster",
      districtCode: "LDN",
      days: 5,
      price: 899
    },
    {
      id: 3,
      name: "Tokyo",
      country: "Japan",
      image: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80",
      district: "Shibuya",
      districtCode: "TKY",
      days: 10,
      price: 1299
    },
    {
      id: 4,
      name: "Paris",
      country: "France",
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80",
      district: "Île-de-France",
      districtCode: "PRS",
      days: 4,
      price: 799
    }
  ];

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Recently Added Places</h1>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Place
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                District
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Days
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {places.map((place) => (
              <tr key={place.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 text-white">
                      <img className="h-10 w-10 rounded-full" src={place.image} alt={place.name} />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-white">{place.name}</div>
                      <div className="text-sm text-white">{place.country}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 font-semibold text-white dark:text-white">
                  <div className="text-sm text-white">{place.district}</div>
                  <div className="text-sm text-white">{place.districtCode}</div>
                </td>
                <td className="px-6 py-4 font-semibold text-white dark:text-white">
                  <div className="text-sm text-white">{place.days}</div>
                  <div className="text-sm text-white">days</div>
                </td>
                <td className="px-6 py-4 font-semibold text-white dark:text-white">
                  ${place.price}
                </td>
                <td className="px-6 py-4 font-semibold text-white dark:text-white">
                  <a href="#" className="text-indigo-600 hover:text-indigo-900 mr-3">
                    View
                  </a>
                  <a href="#" className="text-red-600 hover:text-red-900">
                    Delete
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrder;