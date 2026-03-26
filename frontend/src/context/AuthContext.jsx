import { createContext, useState } from "react";

// Create Context
const AuthContext = createContext();

// Provider Component
const AuthProvider = ({ children }) => {
  // ✅ Initialize directly (no useEffect → no ESLint error)
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  // ==============================
  // LOGIN
  // ==============================
  const login = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setUser(userData);

    // sync across components
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
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Named exports (important)
export { AuthContext, AuthProvider };