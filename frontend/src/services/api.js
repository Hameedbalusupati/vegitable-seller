import axios from "axios";

// ==============================
// CREATE AXIOS INSTANCE
// ==============================
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // change to true if using cookies
});

// ==============================
// REQUEST INTERCEPTOR (ADD TOKEN)
// ==============================
API.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem("token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    } catch (error) {
      console.error("Request interceptor error:", error);
      return config;
    }
  },
  (error) => Promise.reject(error)
);

// ==============================
// RESPONSE INTERCEPTOR
// ==============================
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      alert("Network error. Please check your connection.");
      return Promise.reject(error);
    }

    const { status } = error.response;

    // 🔐 Unauthorized
    if (status === 401) {
      console.warn("Session expired. Logging out...");
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.href = "/login";
    }

    // 🚫 Forbidden
    if (status === 403) {
      alert("You are not allowed to perform this action.");
    }

    // 🔥 Server Error
    if (status >= 500) {
      alert("Server error. Try again later.");
    }

    return Promise.reject(error);
  }
);

export default API;