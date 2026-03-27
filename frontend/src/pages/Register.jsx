import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../hooks/useAuth";
import "./Register.css";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user"
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
  // REGISTER FUNCTION (FIXED)
  // ==============================
  const handleRegister = async (e) => {
    e.preventDefault();

    const name = form.name.trim();
    const email = form.email.trim();
    const password = form.password.trim();
    const confirmPassword = form.confirmPassword.trim();

    // VALIDATION
    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      alert("Enter valid email");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      // ✅ CORRECT ENDPOINT
      const res = await API.post("/auth/register", {
        name,
        email,
        password,
        role: form.role
      });

      console.log("REGISTER RESPONSE:", res.data);

      const token = res.data?.token;
      const user = res.data?.user;
      const message = res.data?.message;

      alert(message || "Registration Successful ✅");

      // ==============================
      // AUTO LOGIN
      // ==============================
      if (token && user) {
        login({ token, user });
      }

      // ==============================
      // REDIRECT (FIXED)
      // ==============================
      if (user?.role === "admin") {
        navigate("/admin");
      } else if (user?.role === "farmer") {
        navigate("/farmer");
      } else {
        navigate("/products"); // ✅ IMPORTANT FIX
      }

    } catch (err) {
      console.error("Register error:", err);

      // 🔥 HANDLE 404 SPECIFICALLY
      if (err.response?.status === 404) {
        alert("❌ API route not found (Check backend URL)");
        return;
      }

      if (!err.response) {
        alert("⏳ Server is waking up... try again in 30 seconds");
        return;
      }

      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert("Registration failed (Email may already exist ❌)");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <form className="register-card" onSubmit={handleRegister}>
        <h2>Register</h2>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
        />

        <select name="role" value={form.role} onChange={handleChange}>
          <option value="user">User</option>
          <option value="farmer">Farmer</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "⏳ Registering..." : "Register"}
        </button>

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}