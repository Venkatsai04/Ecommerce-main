import React, { useEffect, useState } from "react";
import { backendUrl } from "../App";
import axios from "axios";
import { toast } from "react-toastify";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch all orders (admin route)
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${backendUrl}/api/order/admin/all`, {
        headers: { token },
      });

      if (data.success) {
        setOrders(data.orders);
      } else {
        toast.error("Failed to fetch orders");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error fetching orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ✅ Loading state
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[70vh] text-gray-600">
        <p className="animate-pulse">Loading orders...</p>
      </div>
    );

  // ✅ Empty state
  if (orders.length === 0)
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-gray-600">
        <img
          src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
          alt="No orders"
          className="w-32 opacity-70"
        />
        <p className="mt-3 text-lg font-medium">No orders found</p>
      </div>
    );

  return (
    <div className="w-full p-4 bg-white rounded-xl shadow-md">
      <h2 className="mb-6 text-2xl font-semibold text-gray-800">All Orders</h2>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 divide-y divide-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-sm font-semibold text-left text-gray-700">User</th>
              <th className="px-4 py-3 text-sm font-semibold text-left text-gray-700">Items</th>
              <th className="px-4 py-3 text-sm font-semibold text-left text-gray-700">Total</th>
              <th className="px-4 py-3 text-sm font-semibold text-left text-gray-700">Payment</th>
              <th className="px-4 py-3 text-sm font-semibold text-left text-gray-700">Status</th>
              <th className="px-4 py-3 text-sm font-semibold text-left text-gray-700">Date</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr
                key={order._id}
                className="transition-all hover:bg-gray-50"
              >
                <td className="px-4 py-3 text-sm text-gray-700">
                  {order.userId?.email || "Guest"}
                </td>

                <td className="px-4 py-3 text-sm text-gray-700">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 mb-2">
                      <img
                        src={Array.isArray(item.image) ? item.image[0] : item.image}
                        alt={item.name}
                        className="object-cover w-10 h-10 border rounded-md"
                      />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity} | Size: {item.size || "-"}
                        </p>
                      </div>
                    </div>
                  ))}
                </td>

                <td className="px-4 py-3 text-sm font-semibold text-gray-800">
                  ₹{order.totalAmount.toLocaleString("en-IN")}
                </td>

                <td className="px-4 py-3 text-sm capitalize text-gray-700">
                  {order.paymentMethod}
                </td>

                <td className="px-4 py-3 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : order.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>

                <td className="px-4 py-3 text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
