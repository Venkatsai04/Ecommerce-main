import React from 'react';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import NewsLetterBox from '../components/NewsLetterBox';

const About = () => {
  return (
    <div>
      {/* Header */}
      <div className='pt-8 text-2xl text-center border-t'>
        <Title text1={'ABOUT'} text2={'RAW SAHARA'} />
      </div>

      {/* Main About Section */}
      <div className='flex flex-col gap-16 my-10 md:flex-row'>
        <img
          className='w-full md:max-w-[450px]'
          src={assets.about_img}
          alt="About Raw Sahara Thrifted Winter Wear"
        />
        <div className='flex flex-col justify-center gap-6 text-gray-600 md:w-2/4'>
          <p>
            Raw Sahara is a modern Indian thrift-first clothing brand focused on
            premium winter wear, hoodies, and streetwear for men and women. We
            curate unique pieces that balance style, comfort, and affordability —
            because great fashion doesn’t need to be mass-produced.
          </p>

          <p>
            Every Raw Sahara piece is carefully selected for quality, fit, and
            durability. From oversized hoodies to winter essentials, our
            collections are designed for people who want standout style without
            compromising on value or sustainability.
          </p>

          <b className='text-gray-800'>Our Mission</b>
          <p>
            To redefine winter fashion in India by making premium thrifted
            streetwear accessible, stylish, and trustworthy for everyone.
          </p>

          <b className='text-gray-800'>Our Vision</b>
          <p>
            To build Raw Sahara into a leading thrifted winter wear brand in
            India — known for authenticity, quality, and a bold streetwear
            identity.
          </p>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className='py-4 text-xl'>
        <Title text1={'WHY'} text2={'RAW SAHARA'} />
      </div>

      <div className='flex flex-col mb-20 text-sm md:flex-row'>
        <div className='flex flex-col gap-5 px-10 py-8 border md:px-16 sm:py-20'>
          <b>Curated Thrifted Quality</b>
          <p className='text-gray-600'>
            Each winter wear piece is handpicked and quality-checked, ensuring
            you receive durable, stylish clothing that lasts beyond a single
            season.
          </p>
        </div>

        <div className='flex flex-col gap-5 px-10 py-8 border md:px-16 sm:py-20'>
          <b>Streetwear with Purpose</b>
          <p className='text-gray-600'>
            Raw Sahara blends modern streetwear aesthetics with conscious
            fashion, offering unique hoodies and winter fits you won’t find
            everywhere.
          </p>
        </div>

        <div className='flex flex-col gap-5 px-10 py-8 border md:px-16 sm:py-20'>
          <b>Customer-First Experience</b>
          <p className='text-gray-600'>
            From browsing to delivery, our support team ensures a smooth and
            transparent shopping experience every step of the way.
          </p>
        </div>
      </div>

      {/* Newsletter */}
      <NewsLetterBox />
    </div>
  );
};

export default About;
