import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const amount = location.state?.totalAmount;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-10">
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white border-4 border-black max-w-md w-full p-8 shadow-[8px_8px_0px_#000] text-center"
      >
        {/* Icon */}
        <motion.div
          initial={{ rotate: -10, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 8 }}
          className="flex justify-center mb-4"
        >
          <CheckCircle className="w-20 h-20 text-green-600 drop-shadow-[2px_2px_0px_#000]" />
        </motion.div>

        {/* Heading */}
        <h1 className="font-oswald text-4xl font-black uppercase tracking-tight text-black">
          Payment Success
        </h1>

        <p className="mt-3 text-sm text-gray-600 font-manrope leading-relaxed">
          {amount
            ? `Your payment of ₹${amount} was received successfully.`
            : "Your payment has been completed successfully."}
        </p>

        {/* Divider */}
        <div className="w-full h-[2px] bg-black my-6" />

        {/* CTA */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/orders")}
          className="w-full py-4 border-2 border-black bg-black text-white font-oswald uppercase text-sm tracking-widest hover:bg-white hover:text-black transition-all shadow-[4px_4px_0px_#000]"
        >
          Track Your Order
        </motion.button>

        {/* Back to Home */}
        <button
          onClick={() => navigate("/")}
          className="mt-4 w-full py-3 text-xs uppercase font-black tracking-wider font-manrope text-gray-500 hover:text-black"
        >
          Back to Home
        </button>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
