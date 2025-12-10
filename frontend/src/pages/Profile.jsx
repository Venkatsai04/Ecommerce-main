import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();          // call your logout function
    navigate("/login"); // redirect to login after logout
  };

  const handleChangePassword = () => {
    navigate("/reset-password"); // redirect to a change password page
  };

  return (
    <div className="max-w-3xl mx-auto mt-12 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">My Account</h1>

      <div className="grid sm:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="col-span-1 space-y-4">
          <div className="flex items-center gap-4">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3177/3177440.png"
              alt="Profile"
              className="w-20 h-20 rounded-full border"
            />
            <div>
              <p className="font-semibold text-gray-800">{user?.name}</p>
              <p className="text-gray-500 text-sm">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Account Overview */}
        <div className="col-span-2">
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-700">Account Overview</h2>

            <div className="border-t pt-4 space-y-3">
              <p
                onClick={() => navigate("/orders")}
                className="text-gray-700 cursor-pointer hover:text-black"
              >
                🛒 My Orders
              </p>
              <p
                onClick={() => navigate("/returns")}
                className="text-gray-700 cursor-pointer hover:text-black"
              >
                📦 Returns
              </p>
              <p
                onClick={handleChangePassword}
                className="text-gray-700 cursor-pointer hover:text-black"
              >
                🔑 Change Password
              </p>
              <p
                onClick={handleLogout}
                className="text-gray-700 cursor-pointer hover:text-black"
              >
                🚪 Logout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
