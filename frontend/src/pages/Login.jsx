import React, { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const redirect = new URLSearchParams(location.search).get("redirect") || "/";

  const [mode, setMode] = useState("Login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  
  // ⭐ ADDED: State for toggle
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputHandler = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = mode === "Login" ? "user/login" : "user/register";

      const res = await fetch(`${import.meta.env.VITE_PORT}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!data.success) {
        toast.error(data.message);
        setLoading(false);
        return;
      }

      login(data.token, data.user);
      toast.success(`${mode} Successful`);

      navigate(redirect);
    } catch {
      toast.error("Network error");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800">
      <h2 className="text-3xl mt-10">{mode}</h2>

      <form
        key={mode}
        onSubmit={submitHandler}
        className="w-full flex flex-col gap-4"
        autoComplete="on"
      >
        {mode === "Sign Up" && (
          <div className="flex flex-col">
            <label htmlFor="name" className="text-sm font-medium mb-1"></label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={inputHandler}
              placeholder="Your Name"
              className="w-full px-3 py-2 border border-gray-800"
              autoComplete="name"
            />
          </div>
        )}

        <div className="flex flex-col">
          <label htmlFor="email" className="text-sm font-medium mb-1"></label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={inputHandler}
            placeholder="Email"
            className="w-full px-3 py-2 border border-gray-800"
            autoComplete="username"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="password" className="text-sm font-medium mb-1"></label>
          {/* ⭐ MODIFIED: Added relative div and toggle logic */}
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"} // Dynamic type
              value={form.password}
              onChange={inputHandler}
              placeholder="Password"
              className="w-full px-3 py-2 border border-gray-800"
              autoComplete={mode === "Login" ? "current-password" : "new-password"}
              required
            />
            <span 
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-sm text-gray-600 select-none"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>
        </div>

        <button
          type="submit" 
          disabled={loading}
          className="w-full px-8 py-2 mt-4 text-white bg-black hover:bg-gray-800 transition-colors"
        >
          {loading ? "Processing..." : mode}
        </button>
      </form>

      <div
        className="text-sm cursor-pointer hover:underline"
      >
        {mode === "Login" ? (
          <div className="text-center">
            <p onClick={() => {
                setForm({ name: "", email: "", password: "" });
                setMode("Sign Up");
            }}>Don’t have an account? Create one!</p>
            <button
              className="text-sm text-blue-500 hover:underline mt-1"
              onClick={() => navigate("/reset-password")}
            >
              Forgot Password?
            </button>
          </div>
        ) : (
          <p className="text-center" onClick={() => {
            setForm({ name: "", email: "", password: "" });
            setMode("Login");
          }}>
            Already have an account? Login!
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;