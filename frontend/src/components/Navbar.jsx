import React, { useState } from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">

        <div className="logo" onClick={() => navigate("/")}>
          VegMarket
        </div>

        <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </div>

        <ul className={menuOpen ? "nav-links active" : "nav-links"}>

          <li><Link to="/" onClick={closeMenu}>Home</Link></li>
          <li><Link to="/products" onClick={closeMenu}>Products</Link></li>
          <li><Link to="/cart" onClick={closeMenu}>Cart</Link></li>

          {user && user.role === "user" && (
            <>
              <li><Link to="/orders" onClick={closeMenu}>My Orders</Link></li>
              <li><Link to="/profile" onClick={closeMenu}>Profile</Link></li>
            </>
          )}

          {user && user.role === "farmer" && (
            <>
              <li><Link to="/farmer-dashboard" onClick={closeMenu}>Dashboard</Link></li>
            </>
          )}

          {user && user.role === "admin" && (
            <>
              <li><Link to="/admin-dashboard" onClick={closeMenu}>Admin Panel</Link></li>
            </>
          )}

          {!user ? (
            <>
              <li><Link to="/login" onClick={closeMenu}>Login</Link></li>
              <li><Link to="/register" onClick={closeMenu}>Register</Link></li>
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