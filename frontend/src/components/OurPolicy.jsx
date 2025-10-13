import React from 'react';
import { assets } from '../assets/assets';

const OurPolicy = () => {
  return (
    <div className='flex flex-col justify-around gap-12 py-8 text-xs text-center text-gray-700 sm:flex-row sm:gap-2 sm:text-sm md:text-base'>
        <div>
            <img src={assets.exchange_icon} className='w-12 m-auto mb-3' alt="Easy Exchange" />
            <p className='mb-2 font-semibold'>Easy Return & Exchange Policy</p>
            <p className='text-gray-400'>
                Hassle-free returns/exchanges within 10 days.
            </p>
        </div>
        <div>
            <img src={assets.quality_icon} className='w-12 m-auto mb-3' alt="Quality" />
            <p className='mb-2 font-semibold'>Our Quality Policy</p>
            <p className='text-gray-400'>
                Sahara ensures premium quality products in every order.
            </p>
        </div>
        <div>
            <img src={assets.support_img} className='w-12 m-auto mb-3' alt="Support" />
            <p className='mb-2 font-semibold'>Best Customer Support</p>
            <p className='text-gray-400'>
                Reach us via phone, email, or chat for assistance.
            </p>
        </div>
        <div>
            <img src={assets.eco} className='w-12 m-auto mb-3' alt="Eco Friendly" />
            <p className='mb-2 font-semibold'>Eco-Friendly</p>
            <p className='text-gray-400'>
                Committed to a greener and sustainable tomorrow.
            </p>
        </div>
    </div>
  );
};

export default OurPolicy;
