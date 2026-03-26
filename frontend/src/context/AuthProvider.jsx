import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==============================
  // LOAD USER FROM LOCAL STORAGE
  // ==============================
  const loadUser = () => {
    try {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("User load error:", err);
      localStorage.removeItem("user");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();

    // 🔥 Listen for storage updates (important)
    window.addEventListener("storage", loadUser);

    return () => {
      window.removeEventListener("storage", loadUser);
    };
  }, []);

  // ==============================
  // LOGIN
  // ==============================
  const login = (data) => {
    if (!data || !data.token || !data.user) return;

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    setUser(data.user);

    // 🔥 Notify all components
    window.dispatchEvent(new Event("storage"));
  };

  // ==============================
  // LOGOUT
  // ==============================
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);

    window.dispatchEvent(new Event("storage"));
  };

  // ==============================
  // ROLE HELPERS
  // ==============================
  const isAdmin = user?.role === "admin";
  const isFarmer = user?.role === "farmer";
  const isUser = user?.role === "user";

  // ==============================
  // LOADING STATE
  // ==============================
  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        Loading...
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser, // useful sometimes
        login,
        logout,
        isAdmin,
        isFarmer,
        isUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}