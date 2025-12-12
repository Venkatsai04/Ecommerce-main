import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Route, Routes } from "react-router-dom";

import Add from "./pages/Add";
import List from "./pages/List";
import Orders from "./pages/Orders";
import Login from "./components/Login";
import Update from "./pages/Update";
import Analytics from "./pages/Analytics"; // ✅ NEW IMPORT

import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const currency = (price) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(price);
};

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer
        position="top-right"
        autoClose={2000}
        theme="colored"
        transition={Slide}
      />

      {/* LOGIN OR ADMIN UI */}
      {token === "" ? (
        <Login setToken={setToken} />
      ) : (
        <div className="flex flex-col min-h-screen">
          <Navbar setToken={setToken} />

          <div className="flex flex-1 pt-16">
            <Sidebar />

            <main className="flex-1 p-4 md:p-8 overflow-y-auto">
              <Routes>
                {/* ✅ ANALYTICS IS NOW THE DEFAULT ROUTE */}
                <Route path="/" element={<Analytics token={token} />} />
                <Route path="/add" element={<Add token={token} />} />
                <Route path="/list" element={<List token={token} />} />
                <Route path="/orders" element={<Orders token={token} />} />
                <Route path="/update" element={<Update token={token} />} />
              </Routes>
            </main>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;