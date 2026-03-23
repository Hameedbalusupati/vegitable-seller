import axios from "axios";

// ==============================
// BASE URL (ENV REQUIRED)
// ==============================
const BASE_URL = import.meta.env.VITE_API_URL;

// ❌ If not set, show error clearly
if (!BASE_URL) {
  console.error("❌ VITE_API_URL is not defined in .env");
}

// Debug (optional)
console.log("🌐 API URL:", BASE_URL);

// ==============================
// CREATE AXIOS INSTANCE
// ==============================
const API = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // ⏱ increased timeout (Render is slow sometimes)
});

// ==============================
// REQUEST INTERCEPTOR (TOKEN)
// ==============================
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ==============================
// RESPONSE INTERCEPTOR
// ==============================
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // ❌ Network error
    if (!error.response) {
      alert("❌ Network error. Backend may be down.");
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    // 🔐 Unauthorized
    if (status === 401) {
      console.warn("Session expired");

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    // 🚫 Forbidden
    if (status === 403) {
      alert("🚫 You are not allowed to perform this action");
    }

    // 🔥 Server error
    if (status >= 500) {
      alert("🔥 Server error. Try again later.");
    }

    // ❗ Show backend message
    if (data?.message) {
      alert(data.message);
    }

    return Promise.reject(error);
  }
);

export default API;