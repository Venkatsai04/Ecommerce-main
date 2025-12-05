import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

const ProductItem = ({ id, image, name, price, soldOut }) => {
  const { currency } = useContext(ShopContext);

  const originalPrice = Math.round(price / 0.31);

  return (
    <Link to={`/product/${id}`} className="block text-gray-800 relative">

      {/* SOLD OUT BADGE */}
      {soldOut && (
        <div className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded-sm z-10">
          SOLD OUT
        </div>
      )}

      {/* IMAGE */}
      <div className="w-full aspect-[3/4] bg-gray-100 overflow-hidden relative">
        <img
          src={image[0]}
          alt={name}
          className={`w-full h-full object-cover transition-all duration-300 
            ${soldOut ? "opacity-60" : "hover:scale-105"}
          `}
        />
      </div>

      {/* NAME */}
      <p className="pt-3 text-sm font-normal text-gray-700 line-clamp-1">
        {name}
      </p>

      {/* PRICE */}
      <div className="flex items-center gap-2">
        <p className={`text-sm font-semibold ${soldOut ? "text-gray-400" : "text-black"}`}>
          {currency} {price}
        </p>

        <p className="text-xs line-through text-gray-500">
          {currency} {originalPrice}
        </p>

        <p className="text-xs font-bold text-green-600">69% OFF</p>
      </div>
    </Link>
  );
};

export default ProductItem;
