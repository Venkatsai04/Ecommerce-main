import React, { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Sending reset link...");

    try {
      const res = await axios.post("https://your-backend.com/api/auth/forgot-password", {
        email,
      });

      setMessage(res.data.message);
    } catch (error) {
      setMessage("Error: Unable to send email");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md bg-gray-50 p-8 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-4">Forgot Password</h1>
        <p className="text-gray-600 text-center mb-6">
          Enter your registered email to receive a password reset link.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-3 rounded-lg border border-gray-300 mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-900 transition"
          >
            Send Reset Link
          </button>
        </form>

        {message && (
          <p className="text-center text-gray-700 mt-4">{message}</p>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
