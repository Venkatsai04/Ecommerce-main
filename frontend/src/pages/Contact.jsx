import React from 'react';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import NewsLetterBox from '../components/NewsLetterBox';

const Contact = () => {
  return (
    <div>
      {/* Header */}
      <div className='pt-10 text-2xl text-center border-t'>
        <Title text1={'CONTACT'} text2={'RAW SAHARA'} />
      </div>

      {/* Main Contact Section */}
      <div className='flex flex-col justify-center gap-10 my-10 md:flex-row mb-28'>
        <img
          className='w-full md:max-w-[480px]'
          src={assets.contact_img}
          alt="Contact Raw Sahara Support"
        />

        <div className='flex flex-col items-start justify-center gap-6'>
          <p className='text-xl font-semibold text-gray-600'>Our Store</p>
          <p className='text-gray-500'>
            Raw Sahara <br />
            Hyderabad, India
          </p>

          <p className='text-gray-500'>
            Phone: +91-9347175125 <br />
            Email: support@rawsahara.in
          </p>

          <p className='text-xl font-semibold text-gray-600'>Work With Us</p>
          <p className='text-gray-500'>
            Raw Sahara is growing. If you’re passionate about streetwear,
            thrifting, and modern fashion culture, stay tuned for upcoming
            opportunities.
          </p>

          <p className='text-xl font-semibold text-gray-600'>Careers & Contributions</p>
          <p className='text-gray-500'>
            If you’re passionate about streetwear, thrift culture, or want to support and
            add value to the Raw Sahara journey, we’d love to hear from you.
          </p>
          <p className='text-gray-500'>
            Reach out to us at{" "}
            <a
              href="mailto:support@rawsahara.in"
              className="text-black underline"
            >
              support@rawsahara.in
            </a>{" "}
            with your ideas, skills, or collaboration proposals.
          </p>

        </div>
      </div>

      <NewsLetterBox />
    </div>
  );
};

export default Contact;
