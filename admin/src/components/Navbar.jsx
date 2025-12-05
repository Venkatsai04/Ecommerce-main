import React, { useState } from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = ({ setToken }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 z-50 w-full bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-3 md:px-10">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={assets.logo} alt="Logo" className="w-36 sm:w-44" />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/add" className="text-gray-700 hover:text-black">
            Add Items
          </Link>
          <Link to="/list" className="text-gray-700 hover:text-black">
            List Items
          </Link>
          <Link to="/orders" className="text-gray-700 hover:text-black">
            Orders
          </Link>
          <Link to="/update" className="text-gray-700 hover:text-black">
            Update Items
          </Link>

          <button
            onClick={() => setToken("")}
            className="px-5 py-2 text-sm font-medium text-white bg-gray-800 rounded-full hover:bg-gray-900"
          >
            Logout
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Sliding Menu */}
      <div
        className={`md:hidden fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex flex-col mt-20 items-start px-6 space-y-6">
          <Link
            to="/add"
            className="text-gray-700 hover:text-black"
            onClick={() => setMenuOpen(false)}
          >
            Add Items
          </Link>
          <Link
            to="/list"
            className="text-gray-700 hover:text-black"
            onClick={() => setMenuOpen(false)}
          >
            List Items
          </Link>
          <Link
            to="/orders"
            className="text-gray-700 hover:text-black"
            onClick={() => setMenuOpen(false)}
          >
            Orders
          </Link>
          <Link
            to="/update"
            className="text-gray-700 hover:text-black"
            onClick={() => setMenuOpen(false)}
          >
            Update Items
          </Link>

          <button
            onClick={() => {
              setToken("");
              setMenuOpen(false);
            }}
            className="px-5 py-2 text-sm font-medium text-white bg-gray-800 rounded-full hover:bg-gray-900"
          >
            Logout
          </button>
        </div>
      </div>

      {/* ✅ Removed overlay completely so background stays white */}
    </nav>
  );
};

export default Navbar;
