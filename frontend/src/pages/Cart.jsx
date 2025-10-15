import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";

const Cart = () => {
  const { cartItems, products, updateCartItem, removeCartItem, navigate, currency } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    const data = [];
    for (const pid in cartItems) {
      for (const size in cartItems[pid]) {
        if (cartItems[pid][size] > 0) data.push({ _id: pid, size, quantity: cartItems[pid][size] });
      }
    }
    setCartData(data);
  }, [cartItems]);

  const isCartEmpty = cartData.length === 0;

  return (
    <div className="border-t pt-14">
      <div className="mb-3 text-2xl">
        <Title text1="YOUR" text2="CART" />
      </div>

      {isCartEmpty ? (
        <p>Your cart is empty ☹️</p>
      ) : (
        cartData.map((item, idx) => {
          const product = products.find((p) => p._id === item._id);
          if (!product) return null;

          return (
            <div key={idx} className="grid py-4 text-gray-700 border-t border-b sm:grid-cols-[4fr_2fr_0.5fr] gap-4 items-center">
              <div className="flex items-start gap-6">
                <img className="w-16 sm:w-20" src={product.image?.[0] || assets.placeholder_img} alt={product.name} />
                <div>
                  <p className="text-sm sm:text-lg">{product.name}</p>
                  <p className="mt-2">
                    {currency} {product.price}
                  </p>
                  <p className="px-2 border sm:px-3 sm:py-1 bg-slate-50">{item.size}</p>
                </div>
              </div>

              <input
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) =>
                  updateCartItem(item._id, item.size, Number(e.target.value))
                }
                className="px-2 py-1 border max-w-[60px]"
              />

              <img
                onClick={() => removeCartItem(item._id, item.size)}
                className="w-4 cursor-pointer sm:w-5"
                src={assets.bin_icon}
                alt="Remove"
              />
            </div>
          );
        })
      )}

      <div className="flex justify-end my-20">
        <div className="w-full sm:w-[450px]">
          <CartTotal />
          <div className="w-full text-end">
            <button
              onClick={() => navigate("/place-order")}
              className={`px-8 py-3 my-8 text-sm text-white bg-black ${isCartEmpty ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={isCartEmpty}
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
