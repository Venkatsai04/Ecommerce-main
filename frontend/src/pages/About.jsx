import React from 'react';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import NewsLetterBox from '../components/NewsLetterBox';

const About = () => {
  return (
    <div>
      {/* Header */}
      <div className='pt-8 text-2xl text-center border-t'>
        <Title text1={'ABOUT'} text2={'US'} />
      </div>

      {/* Main About Section */}
      <div className='flex flex-col gap-16 my-10 md:flex-row'>
        <img
          className='w-full md:max-w-[450px]'
          src={assets.about_img}
          alt="About Photo"
        />
        <div className='flex flex-col justify-center gap-6 text-gray-600 md:w-2/4'>
          <p>
            Welcome to Sahara, your one-stop online store for premium products across a variety of categories. Our mission is to provide high-quality, stylish, and affordable items that enhance your lifestyle and home.
          </p>
          <p>
            At Sahara, we prioritize your satisfaction. From browsing our curated collections to receiving your order, we ensure a seamless and enjoyable shopping experience. Our team works tirelessly to bring you the latest products and trends, helping you find exactly what you need.
          </p>

          <b className='text-gray-800'>Our Mission</b>
          <p>
            To empower customers by providing top-quality products, exceptional service, and a convenient online shopping experience for all needs.
          </p>

          <b className='text-gray-800'>Our Vision</b>
          <p>
            To be a leading e-commerce brand, trusted by customers across India, delivering excellence in product quality, service, and innovation.
          </p>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className='py-4 text-xl'>
        <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>
      <div className='flex flex-col mb-20 text-sm md:flex-row'>
        <div className='flex flex-col gap-5 px-10 py-8 border md:px-16 sm:py-20'>
          <b>Quality Assurance</b>
          <p className='text-gray-600'>
            Every product at Sahara is carefully selected to meet our high standards, ensuring you receive the best in quality and design.
          </p>
        </div>
        <div className='flex flex-col gap-5 px-10 py-8 border md:px-16 sm:py-20'>
          <b>Convenience</b>
          <p className='text-gray-600'>
            Enjoy an effortless shopping experience with easy browsing, secure payments, timely delivery, and simple returns.
          </p>
        </div>
        <div className='flex flex-col gap-5 px-10 py-8 border md:px-16 sm:py-20'>
          <b>Exceptional Customer Service</b>
          <p className='text-gray-600'>
            Our friendly support team is ready to assist you with any questions or concerns, ensuring a smooth and satisfying shopping experience.
          </p>
        </div>
      </div>

      {/* Newsletter */}
      <NewsLetterBox />
    </div>
  );
};

export default About;
