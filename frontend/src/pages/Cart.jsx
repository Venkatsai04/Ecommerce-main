import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";

const Cart = () => {
  const {
    cartItems,
    products,
    updateCartItem,
    removeCartItem,
    navigate,
    currency,
    getCartAmount,
  } = useContext(ShopContext);

  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    const data = [];
    for (const pid in cartItems) {
      for (const size in cartItems[pid]) {
        if (cartItems[pid][size] > 0)
          data.push({ _id: pid, size, quantity: cartItems[pid][size] });
      }
    }
    setCartData(data);
  }, [cartItems]);

  const isCartEmpty = cartData.length === 0;
  const subtotal = getCartAmount();

  return (
    <div className="border-t pt-14">
      <div className="mb-3 text-2xl">
        <Title text1="YOUR" text2="CART" />
      </div>

      {isCartEmpty ? (
        <p className="text-gray-500 text-lg">Your cart is empty ☹️</p>
      ) : (
        cartData.map((item, idx) => {
          const product = products.find((p) => p._id === item._id);
          if (!product) return null;

          return (
            <div
              key={idx}
              className="grid py-4 text-gray-700 border-t border-b sm:grid-cols-[4fr_2fr_0.5fr] gap-4 items-center"
            >
              <div className="flex items-start gap-6">
                <img
                  className="w-16 sm:w-20"
                  src={product.image?.[0] || assets.placeholder_img}
                  alt={product.name}
                />
                <div>
                  <p className="text-sm sm:text-lg font-medium">{product.name}</p>
                  <p className="mt-2 text-gray-600">
                    {currency} {product.price}
                  </p>
                  <p className="inline-block px-2 border text-sm sm:px-3 sm:py-1 bg-slate-50 rounded mt-1">
                    {item.size}
                  </p>
                </div>
              </div>

              {/* ✅ Fixed Quantity Controls */}
              <div className="flex items-center gap-3 justify-center">
                <button
                  onClick={() => {
                    const newQty = item.quantity - 1;
                    if (newQty >= 1) {
                      updateCartItem(item._id, item.size, newQty);
                    } else {
                      removeCartItem(item._id, item.size);
                    }
                  }}
                  className="px-3 py-1 border rounded hover:bg-gray-100 text-lg"
                >
                  −
                </button>

                {/* ✅ Fixed: Handle empty input properly */}
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) => {
                    const inputValue = e.target.value.trim();
                    
                    // If empty, do nothing (user is still typing)
                    if (inputValue === "") return;
                    
                    const value = Number(inputValue);
                    
                    // Only update if it's a valid positive number
                    if (value >= 1) {
                      updateCartItem(item._id, item.size, value);
                    } else if (value === 0) {
                      removeCartItem(item._id, item.size);
                    }
                    // Ignore negative numbers
                  }}
                  className="w-12 text-center border rounded text-lg"
                />

                <button
                  onClick={() =>
                    updateCartItem(item._id, item.size, item.quantity + 1)
                  }
                  className="px-3 py-1 border rounded hover:bg-gray-100 text-lg"
                >
                  +
                </button>
              </div>

              <img
                onClick={() => removeCartItem(item._id, item.size)}
                className="w-5 cursor-pointer hover:opacity-70"
                src={assets.bin_icon}
                alt="Remove"
              />
            </div>
          );
        })
      )}

      {/* Subtotal Section */}
      {!isCartEmpty && (
        <div className="flex justify-end my-10">
          <div className="text-end">
            <p className="text-lg font-medium">
              Cart Value: {currency}{" "}
              {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Shipping fee calculated at checkout
            </p>
            <button
              onClick={() => navigate("/place-order")}
              className="px-8 py-3 mt-4 text-sm text-white bg-black hover:bg-gray-800"
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;