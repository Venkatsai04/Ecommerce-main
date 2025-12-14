import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const inputHandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_PORT}/user/register`,
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

      toast.success("Account created successfully");
      navigate("/login"); // IMPORTANT: redirect after signup
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
      action="/register"
      autoComplete="on"
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
    >
      <h2 className="text-3xl mt-10">Create Account</h2>

      {/* Chrome needs a stable username field */}
      <input
        type="text"
        name="username"
        autoComplete="username"
        value={form.email}
        readOnly
        hidden
      />

      <input
        id="name"
        name="name"
        type="text"
        placeholder="Your Name"
        autoComplete="name"
        value={form.name}
        onChange={inputHandler}
        required
        className="w-full px-3 py-2 border border-gray-800"
      />

      <input
        id="email"
        name="email"
        type="email"
        placeholder="Email"
        autoComplete="username"
        value={form.email}
        onChange={inputHandler}
        required
        className="w-full px-3 py-2 border border-gray-800"
      />

      <input
        id="password"
        name="password"
        type="password"
        placeholder="Password"
        autoComplete="new-password"
        value={form.password}
        onChange={inputHandler}
        required
        className="w-full px-3 py-2 border border-gray-800"
      />

      <button
        disabled={loading}
        className="w-full px-8 py-2 mt-4 text-white bg-black disabled:opacity-60"
      >
        {loading ? "Creating..." : "Sign Up"}
      </button>

      <p
        className="text-sm cursor-pointer"
        onClick={() => navigate("/login")}
      >
        Already have an account? Login
      </p>
    </form>
  );
};

export default Register;
