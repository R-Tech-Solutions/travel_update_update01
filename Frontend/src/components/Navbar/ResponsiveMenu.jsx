"use client"
import { FaUserCircle } from "react-icons/fa"
import { Link } from "react-router-dom"
import { NavbarLinks } from "./Navbar"

const ResponsiveMenu = ({ showMenu, setShowMenu }) => {
  console.log("showMenu", showMenu)
  return (
    <div
      className={`${
        showMenu ? "left-0" : "-left-[100%]"
      } fixed bottom-0 top-0 z-20 flex h-screen w-[80vw] max-w-xs flex-col justify-between bg-black text-white px-6 pb-6 pt-16 transition-all duration-300 md:hidden rounded-r-3xl shadow-2xl border-r-2 border-blue-700/40`}
    >
      <div className="card">
        <nav className="mt-8">
          <ul className="space-y-4 text-xl">
            {NavbarLinks.map((data, index) => (
              <li key={index}>
                <Link to={data.link} onClick={() => setShowMenu(false)} className="mb-5 inline-block hover:text-blue-400 transition-colors">
                  {data.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>       
  )
}

export default ResponsiveMenu

