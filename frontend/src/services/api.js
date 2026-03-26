import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

// 🔴 Check env
if (!BASE_URL) {
  console.error("❌ VITE_API_URL is not defined");
}

const API = axios.create({
  baseURL: BASE_URL + "/api", // ✅ IMPORTANT FIX
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

    // 🔥 Handle Render sleep
    if (!error.response && originalRequest) {
      if (!originalRequest._retryCount) {
        originalRequest._retryCount = 0;
      }

      if (originalRequest._retryCount < 3) {
        originalRequest._retryCount += 1;

        await new Promise((res) => setTimeout(res, 4000));
        return API(originalRequest);
      }

      return Promise.reject(new Error("Server not responding"));
    }

    // 🔐 Handle auth error
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default API;