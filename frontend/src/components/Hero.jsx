import React from "react";
import { assets } from "../assets/assets";

const Hero = () => {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen px-6 overflow-hidden bg-white sm:px-12 lg:px-20">
      {/* Background Image Blended */}
      <div className="absolute inset-0">
        <img
          src={assets.hero_diwali}
          alt="Diwali Background"
          className="object-cover w-full h-full opacity-80 rounded-3xl mix-blend-multiply"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent rounded-xl"></div>
      </div>

      {/* Content Wrapper */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-6xl gap-10 text-center sm:text-left sm:flex-row sm:gap-16">
        {/* Left Side - Text */}
        <div className="flex flex-col items-center justify-center w-full sm:w-1/2 sm:items-start">
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 sm:justify-start">
              <p className="w-8 md:w-11 h-[2px] bg-[#414141]"></p>
              <p className="text-sm font-medium md:text-base text-[#414141]">
                OUR BEST <span className="text-yellow-500 font-semibold">DIWALI</span> COLLECTION
              </p>
            </div>

            <h1 className="text-4xl font-bold leading-tight text-[#1c1c1c] sm:text-5xl lg:text-6xl prata-regular">
              Sparkle This Diwali ✨
            </h1>

            <p className="text-gray-600 max-w-md text-sm sm:text-base">
              Discover premium festive wear and decor made to add a touch of light to your celebrations.
            </p>

            {/* Attractive Button */}
            <button className="relative inline-flex items-center justify-center px-8 py-3 mt-6 text-sm font-semibold text-white transition-all duration-300 rounded-full shadow-lg bg-gradient-to-r from-blue-400 via-pink-400 to-sky-500 hover:scale-105">
              <span className="relative z-10">✨ Shop Now</span>
              <div className="absolute inset-0 transition-all duration-300 rounded-full opacity-0 bg-gradient-to-r from-orange-400 via-yellow-400 to-yellow-500 blur-xl hover:opacity-40"></div>
            </button>
          </div>

          {/* Review Cards */}
          <div className="flex flex-col w-full gap-4 mt-12 sm:flex-row">
            <div className="flex flex-col justify-between w-full p-5 bg-white border rounded-2xl shadow-md sm:w-1/2 hover:shadow-lg transition-all duration-300">
              <p className="text-gray-700 text-sm italic">
                “Absolutely loved the festive decor I bought! Great quality and super fast delivery.”
              </p>
              <p className="mt-3 text-sm font-semibold text-gray-900">— Priya Sharma</p>
            </div>

            <div className="flex flex-col justify-between w-full p-5 bg-white border rounded-2xl shadow-md sm:w-1/2 hover:shadow-lg transition-all duration-300">
              <p className="text-gray-700 text-sm italic">
                “Beautiful designs! The packaging and presentation made my Diwali extra special.”
              </p>
              <p className="mt-3 text-sm font-semibold text-gray-900">— Aarav Mehta</p>
            </div>
          </div>
        </div>

        {/* Right Side - Decorative Image */}
        <div className="hidden sm:flex sm:w-1/2">
          <img
            src={assets.hero_diwali}
            alt="Hero Image"
            className="w-full h-auto transition-transform duration-700 ease-in-out rounded-3xl shadow-md hover:scale-105"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
