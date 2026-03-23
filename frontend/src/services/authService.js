import API from "./api";

// ==============================
// LOGIN
// ==============================
export const loginUser = async (data) => {
  try {
    const res = await API.post("/login", data);

    // Save token & user
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    return res.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

// ==============================
// REGISTER
// ==============================
export const registerUser = async (data) => {
  try {
    const res = await API.post("/register", data);

    // Optional auto login
    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    }

    return res.data;
  } catch (error) {
    console.error("Register error:", error);
    throw error;
  }
};

// ==============================
// LOGOUT
// ==============================
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// ==============================
// GET CURRENT USER
// ==============================
export const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
};

// ==============================
// GET TOKEN
// ==============================
export const getToken = () => {
  return localStorage.getItem("token");
};

// ==============================
// CHECK AUTH
// ==============================
export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};