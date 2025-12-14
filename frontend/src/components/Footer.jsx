import React, { useContext } from 'react';
import { assets } from '../assets/assets';
import { Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const Footer = () => {
  const { contactInfo } = useContext(ShopContext);

  return (
    <div className="bg-white">
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
        <div>
          <Link to='/'>
            <img
              src={assets.logo}
              className='w-32 mb-5 cursor-pointer'
              alt="Raw Sahara Logo"
            />
          </Link>

          <p className='w-full text-gray-600 md:w-2/3'>
            Raw Sahara is a modern Indian thrifted clothing brand focused on
            premium winter wear, hoodies, and streetwear for men and women. We
            believe in quality over quantity, bold designs, and conscious
            fashion choices. Follow us for new drops, limited collections, and
            exclusive offers.
          </p>
        </div>

        <div>
          <p className='mb-5 text-xl font-medium'>COMPANY</p>
          <ul className='flex flex-col gap-1 text-gray-600'>
            <Link to='/'><li>Home</li></Link>
            <Link to='/about'><li>About Us</li></Link>
            <Link to='/collection'><li>Collections</li></Link>
            <Link to='/privacy-policy'><li>Privacy Policy</li></Link>
          </ul>
        </div>

        <div>
          <p className='mb-5 text-xl font-medium'>GET IN TOUCH</p>
          <ul className='flex flex-col gap-1 text-gray-600'>
            <li>{contactInfo?.phone || "+91-9347175125"}</li>
            <li>{contactInfo?.email || "support@rawsahara.in"}</li>
          </ul>
        </div>
      </div>

      <div>
        <hr />
        <p className='py-5 text-sm text-center'>
          © 2025 Raw Sahara. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
