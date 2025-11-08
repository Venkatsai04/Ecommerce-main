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
    <div className="border-t pt-14 px-4 sm:px-10">
      <div className="mb-6 text-2xl font-semibold text-gray-800">
        <Title text1="YOUR" text2="CART" />
      </div>

      {isCartEmpty ? (
        <div className="text-center py-20">
          <img
            src={assets.empty_cart}
            alt="Empty Cart"
            className="w-32 mx-auto mb-4 opacity-80"
          />
          <p className="text-lg text-gray-600 font-medium">
            Your cart is empty ☹️
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 px-6 py-2 bg-black text-white text-sm rounded-md"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="divide-y divide-gray-200">
            {cartData.map((item, idx) => {
              const product = products.find((p) => p._id === item._id);
              if (!product) return null;

              return (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row justify-between items-center py-5"
                >
                  {/* Left section: image + info */}
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <img
                      className="w-20 h-20 object-cover rounded-md border"
                      src={product.image?.[0] || assets.placeholder_img}
                      alt={product.name}
                    />
                    <div className="flex flex-col">
                      <p className="text-base sm:text-lg font-medium text-gray-800">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Size: <span className="font-medium">{item.size}</span>
                      </p>
                      <p className="mt-1 text-gray-700 font-medium">
                        {currency} {product.price.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Right section: quantity controls + remove */}
                  <div className="flex items-center gap-4 mt-4 sm:mt-0">
                    <div className="flex items-center border rounded-md">
                      <button
                        onClick={() =>
                          updateCartItem(
                            item._id,
                            item.size,
                            Math.max(item.quantity - 1, 1)
                          )
                        }
                        className="px-3 py-1 text-lg font-bold border-r hover:bg-gray-100"
                      >
                        −
                      </button>
                      <span className="px-3 text-base font-medium text-gray-700">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateCartItem(item._id, item.size, item.quantity + 1)
                        }
                        className="px-3 py-1 text-lg font-bold border-l hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>

                    <img
                      onClick={() => removeCartItem(item._id, item.size)}
                      className="w-5 cursor-pointer hover:opacity-70 transition"
                      src={assets.bin_icon}
                      alt="Remove"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Subtotal Section */}
          <div className="flex flex-col items-end mt-10">
            <div className="text-end">
              <p className="text-lg sm:text-xl font-semibold text-gray-800">
                Cart Value:{" "}
                <span className="font-bold">
                  {currency}{" "}
                  {subtotal.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </p>
              <p className="text-sm text-gray-500 mt-1 italic">
                * Shipping fee will be calculated at checkout
              </p>

              <button
                onClick={() => navigate("/place-order")}
                className="px-8 py-3 mt-5 text-sm font-medium text-white bg-black hover:bg-gray-900 rounded-md transition"
              >
                PROCEED TO CHECKOUT
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
