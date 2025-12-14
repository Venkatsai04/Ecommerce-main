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

      {/* CRITICAL FIX: 
        We use key={mode}. This forces React to destroy and recreate the form 
        when switching between Login and Sign Up. This tells the browser: 
        "This is a brand new form, treat autofill logic differently."
      */}
      <form
        key={mode}
        onSubmit={submitHandler}
        className="w-full flex flex-col gap-4"
        autoComplete="on"
      >
        {mode === "Sign Up" && (
          <div className="flex flex-col">
             {/* Labels help browsers identify fields even if hidden visually */}
            <label htmlFor="name" className="text-sm font-medium mb-1">Name</label>
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
          <label htmlFor="email" className="text-sm font-medium mb-1">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={inputHandler}
            placeholder="Email"
            className="w-full px-3 py-2 border border-gray-800"
            /* CRITICAL FIX: 
              Use "username" for the login identifier. 
              This links the email to the password in the browser's vault.
            */
            autoComplete="username"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="password" className="text-sm font-medium mb-1">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={inputHandler}
            placeholder="Password"
            className="w-full px-3 py-2 border border-gray-800"
            /* CRITICAL FIX: 
              "current-password" tells browser to autofill existing login.
              "new-password" tells browser to suggest a strong password and save it.
            */
            autoComplete={mode === "Login" ? "current-password" : "new-password"}
            required
          />
        </div>

        <button
          type="submit" /* Explicit type submit is required for some password managers */
          disabled={loading}
          className="w-full px-8 py-2 mt-4 text-white bg-black hover:bg-gray-800 transition-colors"
        >
          {loading ? "Processing..." : mode}
        </button>
      </form>

      <p
        className="text-sm cursor-pointer hover:underline"
        onClick={() => {
           // Reset form data when switching so autofill doesn't get weird
           setForm({ name: "", email: "", password: "" }); 
           setMode(mode === "Login" ? "Sign Up" : "Login");
        }}
      >
        {mode === "Login"
          ? "Create new account"
          : "Already have an account? Login"}
      </p>
    </div>
  );
};

export default Login;