import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { 
  BarChart3, 
  Users, 
  ShoppingBag, 
  IndianRupee 
} from "lucide-react";

const Analytics = ({ token }) => {
  const [stats, setStats] = useState(null);
  const [latestOrders, setLatestOrders] = useState([]);

  // Helper for Indian Currency formatting
  const formatRupee = (num) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/analytics/dashboard", {
        headers: { token },
      });
      if (response.data.success) {
        setStats(response.data.stats);
        setLatestOrders(response.data.latestOrders);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  if (!stats) return (
    <div className="flex items-center justify-center min-h-[60vh] text-gray-400">
        Loading analytics...
    </div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-light text-gray-800">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Overview of your store performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        
        {/* Card 1: Revenue */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Total Revenue</p>
              <h3 className="text-3xl font-semibold text-gray-800 mt-1">{formatRupee(stats.totalEarnings)}</h3>
            </div>
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <IndianRupee size={20} />
            </div>
          </div>
        </div>

        {/* Card 2: Visits */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Total Visits</p>
              <h3 className="text-3xl font-semibold text-gray-800 mt-1">{stats.totalVisits.toLocaleString()}</h3>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <Users size={20} />
            </div>
          </div>
        </div>

        {/* Card 3: Orders */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Total Orders</p>
              <h3 className="text-3xl font-semibold text-gray-800 mt-1">{stats.totalOrders}</h3>
            </div>
            <div className="p-2 bg-violet-50 rounded-lg text-violet-600">
              <ShoppingBag size={20} />
            </div>
          </div>
        </div>

        {/* Card 4: Products */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Active Products</p>
              <h3 className="text-3xl font-semibold text-gray-800 mt-1">{stats.totalProducts}</h3>
            </div>
            <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
              <BarChart3 size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-50 flex justify-between items-center">
          <h3 className="font-medium text-gray-800">Recent Orders</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {latestOrders.map((order, index) => (
                <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-gray-500">#{order._id.slice(-6)}</td>
                  <td className="px-6 py-4 font-medium text-gray-700">
                    {order.address.firstName} {order.address.lastName}
                  </td>
                  {/* ✅ FIX: Using createdAt */}
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString("en-IN")}
                  </td>
                  {/* ✅ FIX: Using totalAmount */}
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {formatRupee(order.totalAmount)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.status === 'Delivered' 
                        ? 'bg-green-50 text-green-700' 
                        : 'bg-amber-50 text-amber-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;