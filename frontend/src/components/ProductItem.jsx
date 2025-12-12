import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

const ProductItem = ({ id, image, name, price, mrp, soldOut }) => {
  const { currency } = useContext(ShopContext);

  // If mrp is missing -> assume 50% OFF (MRP = price * 2)
  const finalMrp = mrp ? mrp : price * 2;

  const discountPercent = mrp
    ? Math.round(((mrp - price) / mrp) * 100)
    : 70; // default 50% if no mrp

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
        {/* Selling Price */}
        <p className={`text-sm font-semibold ${soldOut ? "text-gray-400" : "text-black"}`}>
          {currency} {price}
        </p>

        {/* MRP */}
        <p className="text-xs line-through text-gray-500">
          {currency} {finalMrp}
        </p>

        {/* Discount */}
        <p className="text-xs font-bold text-green-600">{discountPercent}% OFF</p>
      </div>
    </Link>
  );
};

export default ProductItem;
