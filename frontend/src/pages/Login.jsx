import React, { useState, useContext } from "react";
import { ShopContext } from "../context/ShopContext";

const Login = () => {
  const { loginUser, registerUser } = useContext(ShopContext);
  const [currentState, setCurrentState] = useState("Login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (currentState === "Login") {
      await loginUser(email, password);
    } else {
      await registerUser(name, email, password);
    }
  };

  return (
    <form onSubmit={onSubmitHandler}>
      {currentState === "Sign Up" && (
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      )}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">{currentState}</button>
      <p onClick={() => setCurrentState(currentState === "Login" ? "Sign Up" : "Login")}>
        {currentState === "Login" ? "Create account" : "Login here"}
      </p>
    </form>
  );
};

export default Login;
