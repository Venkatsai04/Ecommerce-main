import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";
import { Link } from "react-router-dom";

const BestSeller = () => {
  const { products } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);

  useEffect(() => {
    const bestProduct = products.filter((item) => item.bestSeller);
    setBestSeller(bestProduct.slice(0, 5));
  }, [products]);

  return (
    <section className="bg-white py-14">
      <div className="text-center mb-10">
        <Title text1="BEST" text2="SELLERS" />
        <p className="w-4/5 md:w-2/3 lg:w-1/2 mx-auto mt-2 text-sm md:text-base text-gray-600">
          Explore our most-loved products — handpicked for their quality, elegance, and popularity among Sahara shoppers.
        </p>
      </div>

      {/* SAME UI AS COLLECTION */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 px-4">
        {bestSeller.map((item) => (
          <ProductItem
            key={item._id}
            id={item._id}
            image={item.image}
            name={item.name}
            price={item.price}
          />
        ))}
      </div>

      <div className="flex justify-center mt-12">
        <Link to="/collection">
          <button className="bg-black text-white px-8 py-3 text-sm md:text-base font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300">
            View All Products
          </button>
        </Link>
      </div>
    </section>
  );
};

export default BestSeller;
