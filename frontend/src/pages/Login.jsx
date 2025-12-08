import React, { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const Login = () => {
  const [currentState, setCurrentState] = useState("Login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = location.state?.from || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint =
        currentState === "Login"
          ? `${import.meta.env.VITE_PORT}/user/login`
          : `${import.meta.env.VITE_PORT}/user/register`;

      const body =
        currentState === "Login"
          ? { email, password }
          : { name, email, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Login failed");
        setLoading(false);
        return;
      }

      // MUST EXIST FROM BACKEND
      login(data.token, data.user);

      toast.success("Logged in");

      navigate(returnTo, { replace: true });
    } catch (err) {
      toast.error("Network error");
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mt-10 mb-2">
        <p className="text-3xl prata-regular">{currentState}</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>

      {currentState !== "Login" && (
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-800"
          placeholder="John Doe"
          onChange={(e) => setName(e.target.value)}
          required
        />
      )}

      <input
        type="email"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="hello@gmail.com"
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button
        disabled={loading}
        className="px-8 py-2 mt-4 font-light text-white bg-black"
      >
        {loading ? "Processing..." : currentState === "Login" ? "Sign In" : "Sign Up"}
      </button>

      <p
        onClick={() =>
          setCurrentState(currentState === "Login" ? "Sign Up" : "Login")
        }
        className="cursor-pointer text-sm mt-[-8px]"
      >
        {currentState === "Login"
          ? "Create a new account"
          : "Login here"}
      </p>
    </form>
  );
};

export default Login;
