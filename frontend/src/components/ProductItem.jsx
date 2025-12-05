import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

const ProductItem = ({ id, image, name, price }) => {
  const { currency } = useContext(ShopContext);

  // Generate MRP (exact 69% OFF)
  const originalPrice = Math.round(price / 0.31);

  return (
    <Link to={`/product/${id}`} className="block text-gray-800">

      {/* PRODUCT IMAGE — FIXED GRID */}
      <div className="w-full aspect-[3/4] bg-gray-100 overflow-hidden">
        <img
          src={image[0]}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* NAME */}
      <p className="pt-3 text-sm font-normal text-gray-700 line-clamp-1">
        {name}
      </p>

      {/* PRICE + DISCOUNT */}
      <div className="flex items-center gap-2">

        {/* Real Price */}
        <p className="text-sm font-semibold text-black">
          {currency} {price}
        </p>

        {/* Fake Original MRP */}
        <p className="text-xs line-through text-gray-500">
          {currency} {originalPrice}
        </p>

        {/* Always 69% OFF 😄 */}
        <p className="text-xs font-bold text-green-600">
          69% OFF
        </p>

      </div>
    </Link>
  );
};

export default ProductItem;
