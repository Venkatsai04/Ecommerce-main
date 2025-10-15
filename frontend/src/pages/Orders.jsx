import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';

const Orders = () => {
  const { currency } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);

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

  return (
    <div className="pt-16 border-t">
      <div className="text-2xl">
        <Title text1="YOUR" text2="ORDERS" />
      </div>

      {orders.length === 0 ? (
        <p className="mt-8 text-gray-500">No orders yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="flex flex-col gap-4 py-4 text-gray-700 border-t border-b">
            {order.items.map((item, i) => (
              <div key={i} className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-6 text-sm">
                  <img className="w-16 sm:w-20" src={item.image} alt={item.name} />
                  <div>
                    <p className="font-medium sm:text-base">{item.name}</p>
                    <p className="text-lg">{currency}&nbsp;{item.price.toFixed(2)}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Size: {item.size}</p>
                    <p className="mt-2 text-gray-400">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex justify-between md:w-1/2">
                  <div className="flex items-center gap-2">
                    <p className="h-2 bg-green-500 rounded-full min-w-2"></p>
                    <p className="text-sm md:text-base">{order.status}</p>
                  </div>
                  <button className="px-4 py-2 text-sm font-medium border rounded-sm">TRACK ORDER</button>
                </div>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;
