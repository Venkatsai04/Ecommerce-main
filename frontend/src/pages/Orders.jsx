import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';

const Orders = () => {
  const { currency } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);

  // Tracking modal states
  const [trackingOrder, setTrackingOrder] = useState(null);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);

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

  // Open tracking modal
  const openTracking = (order) => {
    setTrackingOrder(order);
    setIsTrackingOpen(true);
  };

  // Close tracking modal
  const closeTracking = () => setIsTrackingOpen(false);

  // ----- Static timeline for now -----
  const timeline = [
    { label: "Ordered", active: true },
    { label: "Packed", active: false },
    { label: "Delivery Partner Assigned", active: false },
    { label: "In Transit", active: false },
    { label: "Out for Delivery", active: false },
    { label: "Delivered", active: false }
  ];

  return (
    <div className="pt-16 border-t">
      <div className="text-2xl">
        <Title text1="YOUR" text2="ORDERS" />
      </div>

      {/* ------------------ ORDERS LIST ------------------ */}
      {orders.length === 0 ? (
        <p className="mt-8 text-gray-500">No orders yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="flex flex-col gap-4 py-4 text-gray-700 border-t border-b">
            {order.items.map((item, i) => (
              <div key={i} className="flex flex-col md:flex-row md:items-center md:justify-between">

                {/* LEFT SECTION */}
                <div className="flex items-start gap-6 text-sm">
                  <img className="w-16 sm:w-20 rounded-md" src={item.image} alt={item.name} />
                  <div>
                    <p className="font-medium sm:text-base">{item.name}</p>
                    <p className="text-lg">{currency}{item.price.toFixed(2)}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Size: {item.size}</p>

                    <p className="mt-2 text-gray-400">
                      Date: {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* RIGHT SECTION */}
                <div className="flex justify-between md:w-1/2">
                  <div className="flex items-center gap-2">
                    <p className="h-2 bg-green-500 rounded-full min-w-2"></p>
                    <p className="text-sm md:text-base">{order.status}</p>
                  </div>

                  {/* TRACK ORDER BUTTON */}
                  <button
                    onClick={() => openTracking(order)}
                    className="px-4 py-2 text-sm font-medium border rounded-md hover:bg-gray-100"
                  >
                    TRACK ORDER
                  </button>
                </div>

              </div>
            ))}
          </div>
        ))
      )}

      {/* ------------------ TRACKING SLIDE-UP PANEL ------------------ */}
      {isTrackingOpen && (
        <>
          {/* BACKDROP */}
          <div
            onClick={closeTracking}
            className="fixed inset-0 bg-black bg-opacity-40 z-40"
          ></div>

          {/* BOTTOM SHEET */}
          <div
            className="
              fixed left-0 right-0 bottom-0 
              bg-white rounded-t-xl shadow-xl z-50
              p-6 
              animate-slideUp
              h-[45vh]
              flex flex-col
            "
          >
            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Order Tracking</h2>
              <button
                onClick={closeTracking}
                className="text-2xl font-bold text-gray-700 hover:text-black"
              >
                ×
              </button>
            </div>

            <p className="text-gray-600 text-sm mb-4">
              Order ID: <span className="font-semibold">{trackingOrder?._id}</span>
            </p>

            {/* TIMELINE */}
            <div className="mt-2 space-y-3 overflow-y-auto pb-2">
              {timeline.map((step, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  
                  {/* BULLET */}
                  <div
                    className={`
                      w-3 h-3 rounded-full mt-1
                      ${step.active ? "bg-green-600" : "bg-gray-300"}
                    `}
                  ></div>

                  {/* STEP LABEL */}
                  <p
                    className={`
                      text-sm font-medium
                      ${step.active ? "text-black" : "text-gray-500"}
                    `}
                  >
                    {step.label}
                  </p>
                </div>
              ))}
            </div>

          </div>

          {/* Bottom sheet animation */}
          <style>
            {`
              @keyframes slideUp {
                from { transform: translateY(100%); }
                to { transform: translateY(0); }
              }
              .animate-slideUp {
                animation: slideUp 0.35s ease-out;
              }
            `}
          </style>
        </>
      )}
    </div>
  );
};

export default Orders;
