import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const amount = location.state?.totalAmount;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 120 }}
        className="bg-white shadow-xl rounded-2xl p-10 flex flex-col items-center gap-6"
      >
        {/* Animated Checkmark */}
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-28 w-28 text-blue-500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
        >
          <motion.path
            d="M5 13l4 4L19 7"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        </motion.svg>

        <h1 className="text-3xl font-bold text-gray-800 text-center">
          Payment Successful!
        </h1>
        <p className="text-gray-500 text-center">
          {amount ? `You have paid ₹${amount}.` : "Your payment has been received."}
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/orders")}
          className="mt-4 px-10 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Track Your Orders
        </motion.button>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
