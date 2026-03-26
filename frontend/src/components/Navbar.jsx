import React, { useState, useEffect } from "react";
import "./Navbar.css";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  // ==============================
  // LOAD USER + CART
  // ==============================
  useEffect(() => {
    loadData();

    // Listen for cart updates (important 🔥)
    window.addEventListener("storage", loadData);

    return () => {
      window.removeEventListener("storage", loadData);
    };
  }, []);

  const loadData = () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      setUser(storedUser || null);
    } catch {
      setUser(null);
    }

    try {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartCount(cart.length);
    } catch {
      setCartCount(0);
    }
  };

  // ==============================
  // CLOSE MENU ON ROUTE CHANGE
  // ==============================
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // ==============================
  // LOGOUT
  // ==============================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  // ==============================
  // ACTIVE LINK STYLE
  // ==============================
  const isActive = (path) =>
    location.pathname === path ? "active-link" : "";

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* LOGO */}
        <div
          className="logo"
          onClick={() => navigate("/")}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => e.key === "Enter" && navigate("/")}
        >
          VeggieMart
        </div>

        {/* MENU ICON (MOBILE) */}
        <div
          className="menu-icon"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          ☰
        </div>

        {/* NAV LINKS */}
        <ul className={menuOpen ? "nav-links active" : "nav-links"}>

          <li>
            <Link to="/" className={isActive("/")} onClick={() => setMenuOpen(false)}>
              Home
            </Link>
          </li>

          <li>
            <Link to="/products" className={isActive("/products")} onClick={() => setMenuOpen(false)}>
              Products
            </Link>
          </li>

          <li>
            <Link to="/cart" className={isActive("/cart")} onClick={() => setMenuOpen(false)}>
              Cart ({cartCount})
            </Link>
          </li>

          {/* USER ROLE BASED */}
          {user?.role === "user" && (
            <>
              <li>
                <Link to="/orders" className={isActive("/orders")}>
                  My Orders
                </Link>
              </li>
              <li>
                <Link to="/profile" className={isActive("/profile")}>
                  Profile
                </Link>
              </li>
            </>
          )}

          {user?.role === "farmer" && (
            <li>
              <Link to="/farmer-dashboard" className={isActive("/farmer-dashboard")}>
                Dashboard
              </Link>
            </li>
          )}

          {user?.role === "admin" && (
            <li>
              <Link to="/admin-dashboard" className={isActive("/admin-dashboard")}>
                Admin Panel
              </Link>
            </li>
          )}

          {/* AUTH */}
          {!user ? (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </>
          ) : (
            <li>
              ~<button className="logout-btn" onClick={handleLogout}>
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