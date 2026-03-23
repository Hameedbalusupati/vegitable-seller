import { createContext, useContext, useState, useEffect } from "react";

// Create Context
const AuthContext = createContext();

// Custom Hook
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==============================
  // LOAD USER FROM LOCAL STORAGE
  // ==============================
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error("Error loading user", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ==============================
  // LOGIN
  // ==============================
  const login = (data) => {
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
  // CHECK ROLE
  // ==============================
  const isAdmin = user?.role === "admin";
  const isFarmer = user?.role === "farmer";
  const isUser = user?.role === "user";

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAdmin,
        isFarmer,
        isUser,
        loading
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};