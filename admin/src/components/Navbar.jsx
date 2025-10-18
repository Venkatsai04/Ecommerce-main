import React, { useState } from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = ({ setToken }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 z-50 w-full bg-white/70 backdrop-blur-md shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-3 md:px-10">
        <Link to="/" className="flex items-center gap-2">
          <img src={assets.logo} alt="Logo" className="w-36 sm:w-44" />
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        {/* Desktop Logout */}
        <button
          onClick={() => setToken("")}
          className="hidden px-5 py-2 text-sm font-medium text-white bg-gray-800 rounded-full md:block hover:bg-gray-900"
        >
          Logout
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="flex flex-col items-center bg-gray-100 py-3 space-y-2 md:hidden">
          <Link to="/add" className="text-gray-700 hover:text-black">
            Add Items
          </Link>
          <Link to="/list" className="text-gray-700 hover:text-black">
            List Items
          </Link>
          <Link to="/orders" className="text-gray-700 hover:text-black">
            Orders
          </Link>
          <button
            onClick={() => setToken("")}
            className="px-5 py-2 text-sm font-medium text-white bg-gray-800 rounded-full hover:bg-gray-900"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
