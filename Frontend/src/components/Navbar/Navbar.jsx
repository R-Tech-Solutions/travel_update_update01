"use client";

import { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import ResponsiveMenu from "./ResponsiveMenu";
import { HiMenuAlt3, HiMenuAlt1 } from "react-icons/hi";
import FooterLogo from "../../assets/plc/travel-logo.png";
import { BackendUrl } from "../../BackendUrl";
import axios from "axios";
import PropTypes from "prop-types";

export const NavbarLinks = [
  {
    name: "Home",
    link: "/",
  },
  {
    name: "Service",
    link: "/Service",
  },
  {
    name: "Blog",
    link: "/Blog",
  },
  {
    name: "Gallery", // Fixed typo: Gellery → Gallery
    link: "/Gellery",
  },
];

const DropdownLinks = [
  {
    name: "Our Services",
    link: "/#services",
  },
  {
    name: "Top Brands",
    link: "/#mobile_brands",
  },
  {
    name: "Location",
    link: "/#location",
  },
];

const Navbar = ({ showMenu, setShowMenu }) => {
  const [scrolled, setScrolled] = useState(false);
  const [logoImage, setLogoImage] = useState(null);
  const [logoLoading, setLogoLoading] = useState(true);

  // Cloudinary cloud name must match backend settings
  const CLOUDINARY_CLOUD_NAME = "djbf0hou3";

  // Normalize image URL from backend (Cloudinary or Django media)
  const getImageUrl = (img) => {
    if (!img) return FooterLogo; // Use FooterLogo as fallback
    if (typeof img === "string" && (img.startsWith("http://") || img.startsWith("https://"))) {
      return img;
    }
    if (typeof img === "object" && img !== null) {
      if (img instanceof File) return URL.createObjectURL(img);
      if (typeof img.url === "string") return getImageUrl(img.url);
      if (typeof img.company_logo === "string") return getImageUrl(img.company_logo);
    }
    if (typeof img === "string") {
      const cleanPath = img.startsWith("/") ? img.substring(1) : img;
      if (cleanPath.startsWith("media/") || cleanPath.startsWith("static/")) {
        return `${BackendUrl}/${cleanPath}`;
      }
      const hasDeliveryPrefix = /^(image|video|raw)\//.test(cleanPath);
      const cloudinaryPath = hasDeliveryPrefix ? cleanPath : `image/upload/${cleanPath}`;
      return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/${cloudinaryPath}`;
    }
    return FooterLogo; // Fallback to FooterLogo
  };

  // Fetch logo from API
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        setLogoLoading(true);
        const response = await axios.get(`${BackendUrl}/api/front/`);
        console.log("Fetch logo response:", response.data); // Debug response
        const items = Array.isArray(response.data) ? response.data : [response.data];
        const withCompanyLogo = items.find((it) => it && it.company_logo);
        const logoPath = withCompanyLogo?.company_logo;
        if (logoPath) {
          const normalizedUrl = getImageUrl(logoPath);
          console.log("Normalized logo URL:", normalizedUrl); // Debug URL
          setLogoImage(normalizedUrl);
        } else {
          console.warn("No logo found in response");
          setLogoImage(null);
        }
      } catch (error) {
        console.error("Error fetching logo:", error.response || error.message);
        setLogoImage(null);
      } finally {
        setLogoLoading(false);
      }
    };

    fetchLogo();
  }, []);

  // Track scroll position to add shadow
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full h-[85px] z-50 bg-black/40 backdrop-blur-sm text-white transition-all duration-300 ${
          scrolled ? "shadow-lg shadow-black/50" : ""
        } text-xl font-bold`}
      >
        <div className="container py-4 sm:py-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4 font-bold text-2xl px-2">
              <Link to="/" onClick={() => window.scrollTo(0, 0)}>
                {logoLoading ? (
                  <div className="h-[80px] w-[60px] flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  </div>
                ) : (
                  <img
                    src={logoImage || FooterLogo}
                    alt="Company Logo"
                    className="h-[60px] w-auto"
                    onError={(e) => {
                      console.error("Error loading logo image:", e);
                      e.target.src = FooterLogo;
                    }}
                  />
                )}
              </Link>
            </div>
            <div className="hidden md:block flex-1">
              <ul className="flex justify-end items-center gap-5 mr-4">
                {NavbarLinks.map((link) => (
                  <li
                    key={link.name}
                    className="py-5 px-3 hover:text-primary transition-colors"
                  >
                    <NavLink to={link.link} activeClassName="active">
                      {link.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-center gap-4 px-2">
              <div className="md:hidden block">
                {showMenu ? (
                  <HiMenuAlt1
                    onClick={toggleMenu}
                    className="cursor-pointer transition-all"
                    size={30}
                  />
                ) : (
                  <HiMenuAlt3
                    onClick={toggleMenu}
                    className="cursor-pointer transition-all"
                    size={30}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <ResponsiveMenu setShowMenu={setShowMenu} showMenu={showMenu} />
      </nav>
    </>
  );
};

Navbar.propTypes = {
  showMenu: PropTypes.bool.isRequired,
  setShowMenu: PropTypes.func.isRequired,
};

export default Navbar;