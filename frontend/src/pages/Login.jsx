import { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const redirect =
    new URLSearchParams(location.search).get("redirect") || "/";

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
    if (loading) return;

    setLoading(true);

    try {
      const endpoint =
        mode === "Login" ? "user/login" : "user/register";

      const res = await fetch(
        `${import.meta.env.VITE_PORT}/${endpoint}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      if (mode === "Login") {
        login(data.token, data.user);
        toast.success("Login successful");
        navigate(redirect);
      } else {
        toast.success("Account created. Please login.");
        setMode("Login");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={submitHandler}
      method="post"
      autoComplete="on"
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
    >
      <h2 className="text-3xl mt-10">{mode}</h2>

      {/* 🔑 PASSWORD MANAGER FIX (DO NOT REMOVE) */}
      <input
        type="text"
        name="username"
        autoComplete="username"
        value={form.email}
        readOnly
        hidden
      />

      {mode === "Sign Up" && (
        <input
          name="name"
          value={form.name}
          onChange={inputHandler}
          placeholder="Your Name"
          className="w-full px-3 py-2 border border-gray-800"
          autoComplete="name"
        />
      )}

      <input
        name="email"
        type="email"
        value={form.email}
        onChange={inputHandler}
        placeholder="Email"
        className="w-full px-3 py-2 border border-gray-800"
        autoComplete="username"
        required
      />

      <input
        name="password"
        type="password"
        value={form.password}
        onChange={inputHandler}
        placeholder="Password"
        className="w-full px-3 py-2 border border-gray-800"
        autoComplete={mode === "Login" ? "current-password" : "new-password"}
        required
      />

      <button
        disabled={loading}
        className="w-full px-8 py-2 mt-4 text-white bg-black disabled:opacity-60"
      >
        {loading ? "Processing..." : mode}
      </button>

      <p
        className="text-sm cursor-pointer"
        onClick={() => setMode(mode === "Login" ? "Sign Up" : "Login")}
      >
        {mode === "Login"
          ? "Create new account"
          : "Already have an account? Login"}
      </p>
    </form>
  );
};

export default Login;
