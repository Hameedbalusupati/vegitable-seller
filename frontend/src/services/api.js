import axios from "axios";

// ==============================
// BASE URL SETUP
// ==============================
let BASE_URL = import.meta.env.VITE_API_URL;

// Fallback (important for safety)
if (!BASE_URL) {
  console.error("❌ VITE_API_URL is not defined");
  BASE_URL = "http://localhost:5000"; // fallback
}

// Remove trailing slash
BASE_URL = BASE_URL.replace(/\/$/, "");

// Ensure only ONE /api
const API_URL = BASE_URL.endsWith("/api")
  ? BASE_URL
  : `${BASE_URL}/api`;

// ==============================
// AXIOS INSTANCE
// ==============================
const API = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// ==============================
// REQUEST INTERCEPTOR
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
  async (error) => {
    const originalRequest = error.config;

    // ==============================
    // RETRY LOGIC (ONLY GET REQUESTS)
    // ==============================
    if (!error.response && originalRequest) {
      if (originalRequest.method !== "get") {
        return Promise.reject(error); // don't retry POST/PUT
      }

      if (!originalRequest._retryCount) {
        originalRequest._retryCount = 0;
      }

      if (originalRequest._retryCount < 3) {
        originalRequest._retryCount += 1;

        console.log(`Retrying request... (${originalRequest._retryCount})`);

        await new Promise((res) => setTimeout(res, 4000));
        return API(originalRequest);
      }

      return Promise.reject(new Error("Server not responding ❌"));
    }

    // ==============================
    // AUTH ERROR (401)
    // ==============================
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // 🔥 Better than window.location.href
      window.dispatchEvent(new Event("storage"));
      window.location.assign("/login");
    }

    // ==============================
    // OTHER ERRORS
    // ==============================
    return Promise.reject(error);
  }
);

export default API;