import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from '/travel-logo.png'; // ❌ Don't do this for public images

// Icons
import { LuBox, LuUser, LuMessageSquare, LuCalendar } from "react-icons/lu";
import { FaHome } from "react-icons/fa";
import { CiUser } from "react-icons/ci";

// Icons//

const Sidebar = () => {
  const [activeLink, setActiveLink] = useState(0);
  const handleLinkClick = (index) => {
    setActiveLink(index);
  };
  const SIDEBAR_LINKS = [
    { id: 1, path: "/", name: "Dashboard", icon: FaHome },
    { id: 2, path: "/addplace", name: "AddPlace", icon: CiUser },
    { id: 3, path: "/orders", name: "Orders", icon: LuMessageSquare },
    { id: 4, path: "/userAccess", name: "UserAccess", icon: LuUser },
    { id: 5, path: "/gellery", name: "Gellery", icon: LuBox },
    { id: 6, path: "/Posts", name: "Posts", icon: LuCalendar },
    { id: 7, path: "/Settings", name: "Setting", icon: LuCalendar },
  ];
  return (
    <div className="w-16 md:w-56 fixed left-0 top-0 z-10 h-screen border-r pt-8 px-4 bg-white overflow-y-auto">
      {/* Logo */}

      <div className="mb-8">
        <img src="/travel-logo.png" alt="logo" className="w-28 hidden md:flex" />
        <img src="/vite.svg" alt="logo" className="w-8 flex md:hidden" />
      </div>

      {/* Navigarion Links Start */}
      <ul className="mt-6 space-y-6">
        {SIDEBAR_LINKS.map((link, index) => (
          <li
            key={index}
            className={`font-medium rounded-md py-2 px-5 hover:bg-gray-100 hover:text-indigo-500 ${
              activeLink === index ? "bg-indigo-100 text-indigo-500 " : ""
            }`}
          >
            <Link
              to={link.path}
              className="flex justify-center md:justify-start items-center md:space-x-5"
              onClick={() => handleLinkClick(index)}
            >
              <span>{link.icon()}</span>
              <span className="text-sm text-gray-500 hidden md:flex">
                {link.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      {/* Navigarion Links End */}

      <div className="w-full absolute bottom-5 left-0 px-4 py-2 cursor-pointer text-center">
        <p className="flex items-center space-x2 text-x-s text-white py-2 px-5 bg-gradient-to-r from-idigo-500 to-violet-600 rounded-full">
          {/* <span>?</span> */}
          {/* <span className="hidden md:flex">Need Help?</span> */}
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
