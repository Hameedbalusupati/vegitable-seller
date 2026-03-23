import React, { useState } from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <div className="logo" onClick={() => navigate("/")}>
          🌱 VegMarket
        </div>

        {/* Menu Toggle (Mobile) */}
        <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </div>

        {/* Links */}
        <ul className={menuOpen ? "nav-links active" : "nav-links"}>

          <li><Link to="/">Home</Link></li>
          <li><Link to="/products">Products</Link></li>

          {user && user.role === "customer" && (
            <>
              <li><Link to="/orders">My Orders</Link></li>
              <li><Link to="/profile">Profile</Link></li>
            </>
          )}

          {user && user.role === "farmer" && (
            <>
              <li><Link to="/farmer-dashboard">Dashboard</Link></li>
              <li><Link to="/add-product">Add Product</Link></li>
            </>
          )}

          {user && user.role === "admin" && (
            <>
              <li><Link to="/admin-dashboard">Admin Panel</Link></li>
            </>
          )}

          {!user ? (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </>
          ) : (
            <li>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </li>
          )}

        </ul>
      </div>
    </nav>
  );
};

export default Navbar;