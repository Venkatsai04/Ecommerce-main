import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../App";

const Coupons = () => {
  const [form, setForm] = useState({
    code: "",
    discountType: "flat",
    discountValue: "",
    maxUses: "",
  });

  const [coupons, setCoupons] = useState([]);

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= CREATE COUPON =================
  const createCoupon = async () => {
    try {
      await axios.post(
        `${backendUrl}/api/coupon/admin/create`,
        form,
        { headers: { token } }
      );

      toast.success("Coupon created successfully");
      setForm({
        code: "",
        discountType: "flat",
        discountValue: "",
        maxUses: "",
      });

      fetchCoupons(); // refresh list
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create coupon");
    }
  };

  // ================= FETCH ALL COUPONS =================
  const fetchCoupons = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/coupon/admin/all`,
        { headers: { token } }
      );

      if (data.success) setCoupons(data.coupons);
    } catch {
      toast.error("Failed to load coupons");
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow space-y-8">

      {/* ===== CREATE COUPON ===== */}
      <div className="max-w-md">
        <h2 className="text-xl font-semibold mb-4">Create Coupon</h2>

        <input
          name="code"
          value={form.code}
          onChange={handleChange}
          placeholder="Coupon Code (ex: SAHARA10)"
          className="w-full mb-3 px-3 py-2 border rounded"
        />

        <select
          name="discountType"
          value={form.discountType}
          onChange={handleChange}
          className="w-full mb-3 px-3 py-2 border rounded"
        >
          <option value="flat">Flat Discount (₹)</option>
          <option value="percent">Percentage (%)</option>
        </select>

        <input
          name="discountValue"
          value={form.discountValue}
          onChange={handleChange}
          type="number"
          placeholder="Discount Value"
          className="w-full mb-3 px-3 py-2 border rounded"
        />

        <input
          name="maxUses"
          value={form.maxUses}
          onChange={handleChange}
          type="number"
          placeholder="Max Uses"
          className="w-full mb-4 px-3 py-2 border rounded"
        />

        <button
          onClick={createCoupon}
          className="w-full py-2 bg-black text-white rounded"
        >
          Create Coupon
        </button>
      </div>

      {/* ===== COUPON LIST ===== */}
      <div>
        <h2 className="text-lg font-semibold mb-3">All Coupons</h2>

        {coupons.length === 0 ? (
          <p className="text-sm text-gray-500">No coupons found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Code</th>
                  <th className="p-2 border">Type</th>
                  <th className="p-2 border">Value</th>
                  <th className="p-2 border">Used</th>
                  <th className="p-2 border">Max Uses</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((c) => (
                  <tr key={c._id} className="text-center">
                    <td className="p-2 border font-medium">{c.code}</td>
                    <td className="p-2 border">{c.discountType}</td>
                    <td className="p-2 border">
                      {c.discountType === "flat"
                        ? `₹${c.discountValue}`
                        : `${c.discountValue}%`}
                    </td>
                    <td className="p-2 border">{c.usedCount}</td>
                    <td className="p-2 border">{c.maxUses}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default Coupons;
