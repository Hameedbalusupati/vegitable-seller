import API from "./api";

// ==============================
// LOGIN (API ONLY)
// ==============================
export const loginUser = async (data) => {
  try {
    const res = await API.post("/auth/login", data);

    const { token, user } = res.data || {};

    if (!token || !user) {
      throw new Error("Invalid login response");
    }

    return { token, user };
  } catch (error) {
    console.error("Login error:", error);

    if (!error.response) {
      throw new Error("Server is starting, try again");
    }

    throw error.response?.data?.message || "Login failed";
  }
};

// ==============================
// REGISTER (API ONLY)
// ==============================
export const registerUser = async (data) => {
  try {
    const res = await API.post("/auth/register", data);

    const { token, user } = res.data || {};

    return { token, user, message: res.data?.message };
  } catch (error) {
    console.error("Register error:", error);

    if (!error.response) {
      throw new Error("Server is starting, try again");
    }

    throw error.response?.data?.message || "Registration failed";
  }
};

// ==============================
// LOGOUT (OPTIONAL)
// ==============================
export const logoutUser = () => {
  // Let AuthContext handle state
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  // 🔥 Sync app
  window.dispatchEvent(new Event("storage"));
};

// ==============================
// GET CURRENT USER
// ==============================
export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

// ==============================
// GET TOKEN
// ==============================
export const getToken = () => {
  try {
    return localStorage.getItem("token") || null;
  } catch {
    return null;
  }
};

// ==============================
// CHECK AUTH
// ==============================
export const isAuthenticated = () => {
  return !!getToken();
};