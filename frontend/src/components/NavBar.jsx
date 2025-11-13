import React, { useContext, useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { AuthContext } from '../context/AuthContext';  // <-- added this

const NavBar = () => {
  const [visible, setVisible] = useState(false);
  const { setShowSearch, getCartCount } = useContext(ShopContext);
  const { user, logout } = useContext(AuthContext); // <-- use global auth
  const navigate = useNavigate();

  return (
    <nav className="flex items-center justify-between py-5 font-medium relative">
      
      <Link to="/">
        <img src={assets.logo} className="w-28" alt="Trendify" />
      </Link>

      <ul className="hidden sm:flex gap-6 text-sm text-gray-700">
        {['/', '/collection', '/about', '/contact'].map((path, i) => {
          const names = ['HOME', 'COLLECTION', 'ABOUT', 'CONTACT'];
          return (
            <NavLink
              key={i}
              to={path}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 transition ${
                  isActive ? 'text-black font-semibold' : 'hover:text-gray-900'
                }`
              }
            >
              <p>{names[i]}</p>
            </NavLink>
          );
        })}
      </ul>

      <div className="flex items-center gap-6">

        <img
          onClick={() => setShowSearch(true)}
          src={assets.search_icon}
          className="w-5 cursor-pointer hover:opacity-70 transition"
        />

        {/* Profile icon */}
        <div>
          <img
            onClick={() => navigate(user ? '/profile' : '/login')}
            src={assets.profile_icon}
            className="w-5 cursor-pointer"
          />
        </div>

        <Link to="/cart" className="relative">
          <img src={assets.cart_icon} className="w-5 min-w-5" />
          <p className="absolute right-[-5px] bottom-[-5px] w-4 h-4 flex items-center justify-center bg-black text-white rounded-full text-[8px]">
            {getCartCount()}
          </p>
        </Link>

        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          className="w-5 cursor-pointer sm:hidden"
        />
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity ${
          visible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setVisible(false)}
      ></div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-4/5 bg-white z-50 shadow-xl transform transition-transform duration-300 ${
          visible ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 transition"
          >
            <img src={assets.dropdown_icon} className="h-4 rotate-180" />
            <p>Back</p>
          </div>

          <div className="flex flex-col mt-4 text-gray-700 text-base">
            <NavLink to="/" onClick={() => setVisible(false)} className="px-6 py-3 hover:bg-gray-50">HOME</NavLink>
            <NavLink to="/collection" onClick={() => setVisible(false)} className="px-6 py-3 hover:bg-gray-50">COLLECTION</NavLink>
            <NavLink to="/about" onClick={() => setVisible(false)} className="px-6 py-3 hover:bg-gray-50">ABOUT</NavLink>
            <NavLink to="/contact" onClick={() => setVisible(false)} className="px-6 py-3 hover:bg-gray-50">CONTACT</NavLink>

            {user && (
              <>
                <NavLink
                  to="/profile"
                  onClick={() => setVisible(false)}
                  className="px-6 py-3 hover:bg-gray-50"
                >
                  Profile
                </NavLink>
                <NavLink
                  to="/orders"
                  onClick={() => setVisible(false)}
                  className="px-6 py-3 hover:bg-gray-50"
                >
                  Orders
                </NavLink>

                {/* Logout Button */}
                <button
                  onClick={() => {
                    logout();
                    setVisible(false);
                  }}
                  className="text-left px-6 py-3 hover:bg-gray-50"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
