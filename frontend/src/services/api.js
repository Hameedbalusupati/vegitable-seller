import axios from "axios";

// ==============================
// BASE URL
// ==============================
const BASE_URL = import.meta.env.VITE_API_URL;

if (!BASE_URL) {
  console.error("VITE_API_URL is not defined in .env");
}

console.log("API URL:", BASE_URL);

// ==============================
// AXIOS INSTANCE
// ==============================
const API = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // ⏱ 30 sec (important for Render wake-up)
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
  async (error) => {
    // ==============================
    // NETWORK ERROR (RETRY LOGIC)
    // ==============================
    if (!error.response) {
      console.warn("Backend waking up... Retrying request");

      const originalRequest = error.config;

      // Retry only once
      if (!originalRequest._retry) {
        originalRequest._retry = true;

        await new Promise((resolve) => setTimeout(resolve, 5000)); // wait 5 sec

        return API(originalRequest); // retry request
      }

      // After retry fails
      alert("Server is starting... please refresh in a few seconds.");
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    // ==============================
    // UNAUTHORIZED (401)
    // ==============================
    if (status === 401) {
      console.warn("Session expired");

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    // ==============================
    // FORBIDDEN (403)
    // ==============================
    if (status === 403) {
      alert("You are not allowed to perform this action");
    }

    // ==============================
    // SERVER ERROR (500+)
    // ==============================
    if (status >= 500) {
      alert("Server error. Try again later.");
    }

    // ==============================
    // BACKEND MESSAGE
    // ==============================
    if (data?.message) {
      alert(data.message);
    }

    return Promise.reject(error);
  }
);

export default API;