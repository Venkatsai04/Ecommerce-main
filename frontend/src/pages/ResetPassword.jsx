import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  // ⭐ ADDED: State for toggle
  const [showPassword, setShowPassword] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    // 1. Client-side Validation (UI Best Practice)
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match!");
    }
    if (password.length < 8) {
      return toast.error("Password must be at least 8 characters long.");
    }

    setLoading(true);

    try {
      // 2. USING YOUR EXACT API STRUCTURE
      // We send the token in the URL and the data as { password }
      const res = await axios.post(
        `${import.meta.env.VITE_PORT}/user/reset-password/${token}`,
        { password } 
      );

      if (!res.data.success) {
        toast.error(res.data.message);
        setLoading(false);
        return;
      }

      toast.success("Password updated successfully!");
      navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Invalid or expired link");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800">
      <h2 className="text-3xl mt-10">Reset Password</h2>
      <p className="text-sm text-gray-500 mb-4 text-center">
        Enter a new strong password for your account.
      </p>

      <form 
        onSubmit={submitHandler} 
        className="w-full flex flex-col gap-4"
        autoComplete="off"
      >
        
        {/* NEW PASSWORD */}
        <div className="flex flex-col">
          <label htmlFor="new-password" className="text-sm font-medium mb-1">
            New Password
          </label>
          {/* ⭐ MODIFIED: Added relative div and toggle logic */}
          <div className="relative">
            <input
              id="new-password"
              type={showPassword ? "text" : "password"} // Dynamic type
              placeholder="At least 8 characters"
              className="w-full px-3 py-2 border border-gray-800"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              // Best Practice: Tells browser to update the saved password
              autoComplete="new-password"
            />
            <span 
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-sm text-gray-600 select-none"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>
        </div>

        {/* CONFIRM PASSWORD */}
        <div className="flex flex-col">
          <label htmlFor="confirm-password" className="text-sm font-medium mb-1">
            Confirm Password
          </label>
          <input
            id="confirm-password"
            type={showPassword ? "text" : "password"} // Matches the toggle above
            placeholder="Confirm new password"
            className="w-full px-3 py-2 border border-gray-800"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-8 py-2 mt-4 text-white bg-black hover:bg-gray-800 transition-colors disabled:bg-gray-400"
        >
          {loading ? "Updating..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;