import React, { createContext, useContext, useState, useEffect } from "react";

// Create Context
export const AuthContext = createContext();

// ==============================
// PROVIDER
// ==============================
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user from localStorage on start
  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) setUser(storedUser);
    } catch {
      setUser(null);
    }
  }, []);

  // ==============================
  // LOGIN
  // ==============================
  const login = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setUser(userData);

    // Notify other components (important 🔥)
    window.dispatchEvent(new Event("storage"));
  };

  // ==============================
  // LOGOUT
  // ==============================
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);

    window.dispatchEvent(new Event("storage"));
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ==============================
// CUSTOM HOOK
// ==============================
export const useAuth = () => {
  return useContext(AuthContext);
};