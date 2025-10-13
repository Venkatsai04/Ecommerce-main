import React from "react";
import { assets } from "../assets/assets";

const Hero = () => {
  return (
    <section className="relative flex flex-col items-center justify-center w-full min-h-screen overflow-hidden bg-gradient-to-br from-yellow-50 via-white to-yellow-100 sm:flex-row">
      {/* Left Side Text */}
      <div className="flex flex-col items-start justify-center w-full px-6 py-10 sm:w-1/2 lg:px-16">
        <div className="text-[#2b2b2b] space-y-4">
          <div className="flex items-center gap-2">
            <p className="w-8 md:w-11 h-[2px] bg-[#414141]"></p>
            <p className="text-sm font-medium md:text-base">
              OUR BEST <span className="text-yellow-400 font-semibold">DIWALI</span> COLLECTION
            </p>
          </div>

          <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl prata-regular">
            Sparkle This Season ✨
          </h1>

          <p className="text-gray-600 max-w-md text-sm sm:text-base">
            Discover handcrafted festive essentials that blend tradition with elegance. Limited-time Diwali offers!
          </p>

          <button className="mt-6 px-6 py-3 text-sm font-semibold text-white transition-transform duration-300 transform bg-yellow-500 rounded-full shadow-md hover:bg-yellow-600 hover:-translate-y-1">
            Shop Now
          </button>
        </div>

        {/* Review Cards */}
        <div className="flex flex-col w-full gap-4 mt-12 sm:flex-row">
          <div className="flex flex-col items-start justify-between w-full p-5 transition-transform duration-300 bg-white border rounded-2xl shadow-md sm:w-1/2 hover:-translate-y-1">
            <p className="text-gray-700 text-sm italic">
              “Absolutely loved the festive decor I bought! Great quality and super fast delivery.”
            </p>
            <p className="mt-3 text-sm font-semibold text-gray-900">— Priya Sharma</p>
          </div>

          <div className="flex flex-col items-start justify-between w-full p-5 transition-transform duration-300 bg-white border rounded-2xl shadow-md sm:w-1/2 hover:-translate-y-1">
            <p className="text-gray-700 text-sm italic">
              “Beautiful designs! The packaging and presentation made my Diwali extra special.”
            </p>
            <p className="mt-3 text-sm font-semibold text-gray-900">— Aarav Mehta</p>
          </div>
        </div>
      </div>

      {/* Right Side Image */}
      <div className="relative flex items-center justify-center w-full h-full sm:w-1/2">
        <img
          src={assets.hero_diwali}
          alt="Diwali Hero"
          className="object-cover w-full h-full transition-transform duration-700 ease-in-out hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/40 to-transparent sm:hidden"></div>
      </div>
    </section>
  );
};

export default Hero;
