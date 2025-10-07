import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { Link, NavLink } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const NavBar = () => {
  const [visible, setVisible] = useState(false);
  const { setShowSearch, getCartCount } = useContext(ShopContext);

  return (
    <nav className="flex items-center justify-between py-5 font-medium relative">
      {/* Logo */}
      <Link to="/">
        <img src={assets.logo} className="w-36" alt="Trendify" />
      </Link>

      {/* Desktop Menu */}
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
              <hr className={`h-[1.5px] w-2/4 bg-gray-700 border-none transition ${path === window.location.pathname ? 'block' : 'hidden'}`} />
            </NavLink>
          );
        })}
      </ul>

      {/* Icons Section */}
      <div className="flex items-center gap-6">
        <img
          onClick={() => setShowSearch(true)}
          src={assets.search_icon}
          className="w-5 cursor-pointer hover:opacity-70 transition"
          alt="Search Products"
        />

        {/* Profile Dropdown */}
        <div className="relative group">
          <Link to="/login">
            <img src={assets.profile_icon} className="w-5 cursor-pointer" alt="Profile" />
          </Link>
          <div className="absolute right-0 mt-2 hidden group-hover:block">
            <div className="bg-white rounded-xl shadow-md border border-gray-100 py-2 w-40 text-gray-600">
              {['Profile', 'Orders', 'Logout'].map((item, i) => (
                <p key={i} className="px-5 py-2 text-sm hover:bg-gray-50 hover:text-black cursor-pointer">
                  {item}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Cart */}
        <Link to="/cart" className="relative">
          <img src={assets.cart_icon} className="w-5 min-w-5" alt="Cart" />
          <p className="absolute right-[-5px] bottom-[-5px] w-4 h-4 flex items-center justify-center bg-black text-white rounded-full text-[8px]">
            {getCartCount()}
          </p>
        </Link>

        {/* Mobile Menu Icon */}
        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          className="w-5 cursor-pointer sm:hidden"
          alt="Menu"
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
            <img src={assets.dropdown_icon} className="h-4 rotate-180" alt="Back" />
            <p>Back</p>
          </div>

          <div className="flex flex-col mt-4 text-gray-700 text-base">
            {[
              { path: '/', name: 'HOME' },
              { path: '/collection', name: 'COLLECTION' },
              { path: '/about', name: 'ABOUT' },
              { path: '/contact', name: 'CONTACT' },
            ].map((item, i) => (
              <NavLink
                key={i}
                to={item.path}
                onClick={() => setVisible(false)}
                className={({ isActive }) =>
                  `px-6 py-3 transition hover:bg-gray-50 ${
                    isActive ? 'bg-gray-100 font-semibold' : ''
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
