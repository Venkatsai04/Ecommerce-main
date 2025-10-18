import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { ChevronRight, ChevronLeft } from "lucide-react";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`${
        collapsed ? "w-16" : "w-60"
      } min-h-screen bg-white shadow-md border-r transition-all duration-300 flex flex-col`}
    >
      <div className="flex justify-end p-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-600 hover:text-black"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <div className="flex flex-col gap-3 px-3">
        {[
          { to: "/add", icon: assets.add_icon, label: "Add Product" },
          { to: "/list", icon: assets.parcel_icon, label: "Product List" },
          { to: "/orders", icon: assets.order_icon, label: "Orders" },
        ].map((link, idx) => (
          <NavLink
            key={idx}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive ? "bg-gray-900 text-white" : "hover:bg-gray-100"
              }`
            }
          >
            <img src={link.icon} alt={link.label} className="w-5 h-5" />
            {!collapsed && (
              <span className="text-[15px] font-medium">{link.label}</span>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
