/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useState, useEffect } from "react";

// ==============================
// CREATE CONTEXT
// ==============================
const AuthContext = createContext();

// ==============================
// CUSTOM HOOK
// ==============================
export const useAuth = () => {
  return useContext(AuthContext);
};

// ==============================
// PROVIDER
// ==============================
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==============================
  // LOAD USER
  // ==============================
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error("Error loading user:", err);
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  }, []);

  // ==============================
  // LOGIN
  // ==============================
  const login = (data) => {
    if (!data || !data.token || !data.user) return;

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
  };

  // ==============================
  // LOGOUT
  // ==============================
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  // ==============================
  // ROLE CHECKS
  // ==============================
  const isAdmin = user?.role === "admin";
  const isFarmer = user?.role === "farmer";
  const isUser = user?.role === "user";

  // ==============================
  // LOADING UI
  // ==============================
  if (loading) {
    return <div style={{ textAlign: "center" }}>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAdmin,
        isFarmer,
        isUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;