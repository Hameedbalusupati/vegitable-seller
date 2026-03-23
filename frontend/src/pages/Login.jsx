import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api"; // ✅ FIXED
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  // ==============================
  // HANDLE INPUT
  // ==============================
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // ==============================
  // LOGIN FUNCTION
  // ==============================
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      alert("⚠️ Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/login", form); // ✅ FIXED

      // ✅ Save token + user
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("✅ Login Successful");

      // ✅ Redirect based on role
      const role = res.data.user?.role;

      if (role === "admin") {
        navigate("/admin");
      } else if (role === "farmer") {
        navigate("/farmer");
      } else {
        navigate("/");
      }

    } catch (err) {
      console.error("Login error:", err);

      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert("❌ Invalid email or password");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleLogin}>
        <h2>Login 🔐</h2>

        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}