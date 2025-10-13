import React, { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  useEffect(() => {
    if (token && !user) {
      // Fetch user from backend using token, optional
      // Example:
      // fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}` }})
      //   .then(res => res.json())
      //   .then(data => setUser(data.user));

      // For now, just make sure user exists in localStorage after login
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) setUser(storedUser);
    }
  }, [token]);

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(token);
    setUser(userData); // This must include _id and name
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ token, setToken, user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
