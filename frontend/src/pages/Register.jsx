import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import "./Register.css";

export default function Register() {
  const navigate = useNavigate();

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
  // REGISTER FUNCTION
  // ==============================
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      alert("Please fill all fields");
      return;
    }

    if (form.password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      // 🔥 TRY CORRECT ENDPOINT
      const res = await API.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role
      });
      // 👉 if fails, try "/register"

      const { token, user, message } = res.data;

      if (!res.data) {
        alert("Invalid server response");
        return;
      }

      alert(message || "Registration Successful");

      // ==============================
      // OPTIONAL AUTO LOGIN
      // ==============================
      if (token && user) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
      }

      navigate("/login");

    } catch (err) {
      console.error("Register error:", err);

      // 🔥 Handle Render sleep
      if (!err.response) {
        alert("⏳ Server is starting... please try again.");
        return;
      }

      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert("Registration failed (Email may already exist)");
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

        {/* ROLE SELECT */}
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="user">User</option>
          <option value="farmer">Farmer</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}