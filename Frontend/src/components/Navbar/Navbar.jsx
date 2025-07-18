"use client";

import { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import ResponsiveMenu from "./ResponsiveMenu";
import { HiMenuAlt3, HiMenuAlt1 } from "react-icons/hi";
import FooterLogo from "../../assets/plc/travel-logo.png";

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
		name: "Gellery",
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

const Navbar = ({ handleOrderPopup, showMenu, setShowMenu }) => {
	const [scrolled, setScrolled] = useState(false);

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
				}text-xl font-bold`}
			>
				<div className="container py-4 sm:py-2">
					<div className="flex justify-between items-center">
						<div className="flex items-center gap-4 font-bold text-2xl px-2">
							<Link to={"/"} onClick={() => window.scrollTo(0, 0)}>
								<img
									src={FooterLogo}
									alt="Company Logo"
									className="h-[80px] w-auto" // Add appropriate sizing classes
								/>
							</Link>
						</div>
						<div className="hidden md:block flex-1">
							{" "}
							{/* flex-1 to take remaining space */}
							<ul className="flex justify-end items-center gap-5 mr-4">
								{" "}
								{/* justify-end + gap-10 */}
								<li className="py-5 px-3 hover:text-primary transition-colors">
									<NavLink to="/" activeClassName="active">
										Home
									</NavLink>
								</li>
								<li className="py-5 px-3 hover:text-primary transition-colors">
									<NavLink to="/Service" activeClassName="active">
										Service
									</NavLink>
								</li>
								<li className="py-5 px-3 hover:text-primary transition-colors">
									<NavLink to="/Blog" activeClassName="active">
										Blogs
									</NavLink>
								</li>
								<li className="py-5 px-3 hover:text-primary transition-colors">
									<NavLink to="/gellery" activeClassName="active">
										Gallery
									</NavLink>
								</li>
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

export default Navbar;
