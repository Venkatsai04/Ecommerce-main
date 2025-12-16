import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const CouponOverlay = () => {
  const [show, setShow] = useState(false);
  const COUPON_CODE = "FIRST100";

  useEffect(() => {
    const timer = setTimeout(() => {
      // show only once per session
      if (!sessionStorage.getItem("couponShown")) {
        setShow(true);
        sessionStorage.setItem("couponShown", "true");
      }
    }, 8000); // ⏱ 8 seconds

    return () => clearTimeout(timer);
  }, []);

  const copyCode = () => {
    navigator.clipboard.writeText(COUPON_CODE);
    toast.success("Coupon code copied!");
  };

  if (!show) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-60 z-50"
        onClick={() => setShow(false)}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white  shadow-2xl w-[90%] max-w-sm p-6 relative animate-scaleIn">

          {/* Close */}
          <button
            onClick={() => setShow(false)}
            className="absolute top-3 right-3 text-xl font-bold"
          >
            ×
          </button>

          {/* Content */}
          <h2 className="text-2xl font-bold text-center mb-2">
            🎉 Opening Offer
          </h2>

          <p className="text-center text-gray-600 mb-4">
            Flat <b>₹100 OFF</b> on your first order
          </p>

          <div className="border-2 border-dashed border-black  py-3 text-center mb-3">
            <p className="text-sm text-gray-500">Use Code</p>
            <p className="text-xl font-bold tracking-widest">
              {COUPON_CODE}
            </p>
          </div>

          <p className="text-xs text-gray-500 text-center mb-4">
            ⚡ Valid for first 100 users only
          </p>

          <button
            onClick={copyCode}
            className="w-full bg-black text-white py-2 text-sm"
          >
            COPY CODE
          </button>
        </div>
      </div>

      {/* Animation */}
      <style>{`
        @keyframes scaleIn {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scaleIn {
          animation: scaleIn 0.25s ease-out;
        }
      `}</style>
    </>
  );
};

export default CouponOverlay;
