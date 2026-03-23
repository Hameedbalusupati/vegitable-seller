import API from "./api";

// ==============================
// LOGIN
// ==============================
export const loginUser = async (data) => {
  try {
    const res = await API.post("/auth/login", data);

    const { token, user } = res.data || {};

    if (!token || !user) {
      throw new Error("Invalid login response");
    }

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    return res.data;
  } catch (error) {
    console.error("Login error:", error);

    if (!error.response) {
      throw new Error("Server is starting, try again");
    }

    throw error;
  }
};

// ==============================
// REGISTER
// ==============================
export const registerUser = async (data) => {
  try {
    const res = await API.post("/auth/register", data);

    const { token, user } = res.data || {};

    if (token && user) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    }

    return res.data;
  } catch (error) {
    console.error("Register error:", error);

    if (!error.response) {
      throw new Error("Server is starting, try again");
    }

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