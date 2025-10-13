import React from 'react';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import NewsLetterBox from '../components/NewsLetterBox';

const Contact = () => {
  return (
    <div>
      {/* Header */}
      <div className='pt-10 text-2xl text-center border-t'>
        <Title text1={'CONTACT'} text2={'US'} />
      </div>

      {/* Main Contact Section */}
      <div className='flex flex-col justify-center gap-10 my-10 md:flex-row mb-28'>
        {/* Image */}
        <img
          className='w-full md:max-w-[480px]'
          src={assets.contact_img}
          alt="Contact Photo"
        />

        {/* Info */}
        <div className='flex flex-col items-start justify-center gap-6'>
          <p className='text-xl font-semibold text-gray-600'>Our Store</p>
          <p className='text-gray-500'>
            Sahara Store <br />
            Hyderabad, India
          </p>
          <p className='text-gray-500'>
            Tel: +91-9347175125 <br />
            Email: sahara.store.online@gmail.com
          </p>

          <p className='text-xl font-semibold text-gray-600'>Careers at Sahara</p>
          <p className='text-gray-500'>
            Join Sahara! Explore job opportunities and help us bring the best Diwali collections to our customers.
          </p>
          Coming soon...
        </div>
      </div>

      {/* Newsletter Box */}
      <NewsLetterBox />
    </div>
  );
};

export default Contact;
