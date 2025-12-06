import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const { currency } = useContext(ShopContext);
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);

  const [trackingOrder, setTrackingOrder] = useState(null);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);

  const steps = [
    "Ordered",
    "Packed",
    "Delivery Partner Assigned",
    "In Transit",
    "Out for Delivery",
    "Delivered",
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4000/api/order/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setOrders(data.orders);
    };
    fetchOrders();
  }, []);

  const openTracking = (order) => {
    setTrackingOrder(order);
    setIsTrackingOpen(true);
  };

  const closeTracking = () => setIsTrackingOpen(false);

  return (
    <div className="pt-16 border-t">
      <div className="text-2xl">
        <Title text1="YOUR" text2="ORDERS" />
      </div>

      {orders.length === 0 ? (
        <p className="mt-8 text-gray-500">No orders yet.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            className="flex flex-col gap-4 py-4 text-gray-700 border-t border-b"
          >
            {order.items.map((item, i) => (
              <div
                key={i}
                className="flex flex-col md:flex-row md:items-center md:justify-between"
              >
                <div
                  onClick={() => navigate(`/product/${item.productId}`)}
                  className="flex items-start gap-6 text-sm cursor-pointer"
                >
                  <img
                    className="w-16 sm:w-20 rounded"
                    src={item.image}
                    alt={item.name}
                  />

                  <div>
                    <p className="font-medium sm:text-base">{item.name}</p>
                    <p className="text-lg">
                      {currency}
                      {item.price.toFixed(2)}
                    </p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Size: {item.size}</p>
                    <p className="mt-2 text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between md:w-1/2 mt-4 md:mt-0">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <span className="h-2 w-2 block bg-green-500 rounded-full"></span>
                      <span className="absolute inset-0 h-2 w-2 bg-green-400 rounded-full animate-ping opacity-60"></span>
                    </div>
                    <p className="text-sm md:text-base">{order.status}</p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openTracking(order);
                    }}
                    className="px-4 py-2 text-sm font-medium border rounded-sm hover:bg-gray-100"
                  >
                    TRACK ORDER
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))
      )}

      {isTrackingOpen && (
        <>
          <div
            onClick={closeTracking}
            className="fixed inset-0 bg-black bg-opacity-40 z-40"
          ></div>

          <div
            className="
              fixed left-0 right-0 bottom-0 bg-white 
              rounded-t-2xl shadow-xl z-50 p-6 
              h-[55vh] animate-slideUp
            "
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-semibold text-black">
                Order Tracking
              </h2>

              <button onClick={closeTracking}>
                <span className="text-2xl font-bold">×</span>
              </button>
            </div>

            <p className="text-gray-600 text-sm">
              Order ID: {trackingOrder?._id}
            </p>

            <div className="mt-6 pl-2 flex gap-6">
              <div className="relative">
                <div className="absolute top-0 bottom-0 w-[3px] bg-black left-[7px] h-[calc(100%-20px)]"></div>

                {steps.map((label, index) => (
                  <div key={index} className="flex items-start gap-4 mb-6">
                    <div className="relative mt-[2px]">

                      {/* 🔴 green DOT FOR INDEX 0 */}
                      <div
                        className={`w-4 h-4 rounded-full border-2 ${
                          index === 0
                            ? "bg-green-600 border-green-600"
                            : "bg-white border-black"
                        }`}
                      ></div>

                      {index === 0 && (
                        <span className="absolute inset-0 w-4 h-4 bg-red-600 rounded-full animate-ping opacity-70"></span>
                      )}
                    </div>

                    <p className="text-sm font-medium text-black">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={closeTracking}
              className="w-full mt-4 py-3 bg-black text-white rounded-lg"
            >
              Close
            </button>
          </div>

          <style>{`
            @keyframes slideUp {
              from { transform: translateY(100%); }
              to { transform: translateY(0); }
            }
            .animate-slideUp {
              animation: slideUp .35s ease-out;
            }
          `}</style>
        </>
      )}
    </div>
  );
};

export default Orders;
