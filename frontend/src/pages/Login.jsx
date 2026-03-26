import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../hooks/useAuth";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth(); // 🔥 use context

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  // ==============================
  // HANDLE INPUT
  // ==============================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // ==============================
  // LOGIN FUNCTION
  // ==============================
  const handleLogin = async (e) => {
    e.preventDefault();

    const email = form.email.trim();
    const password = form.password.trim();

    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/login", {
        email,
        password
      });

      const { token, user } = res.data;

      if (!token || !user) {
        alert("Invalid server response");
        return;
      }

      // 🔥 USE CONTEXT (IMPORTANT)
      login({ token, user });

      alert("Login Successful ✅");

      // ==============================
      // ROLE BASED REDIRECT
      // ==============================
      if (user.role === "admin") {
        navigate("/admin");
      } else if (user.role === "farmer") {
        navigate("/farmer");
      } else {
        navigate("/");
      }

    } catch (err) {
      console.error("Login error:", err);

      if (!err.response) {
        alert("Server is starting... try again in a few seconds.");
        return;
      }

      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert("Invalid email or password ❌");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleLogin}>
        <h2>Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          value={form.password}
          onChange={handleChange}
        />

        <button type="submit" disabled={loading}>
          {loading ? "⏳ Logging in..." : "Login"}
        </button>

        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}