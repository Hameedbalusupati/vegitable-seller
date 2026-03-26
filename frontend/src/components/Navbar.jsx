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
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      setUser(storedUser);
    } catch {
      setUser(null);
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartCount(cart.length);
  }, []);

  // ==============================
  // LOGOUT
  // ==============================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const closeMenu = () => setMenuOpen(false);

  // ==============================
  // ACTIVE LINK STYLE
  // ==============================
  const isActive = (path) => (location.pathname === path ? "active-link" : "");

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* LOGO */}
        <div className="logo" onClick={() => navigate("/")}>
          VeggieMart
        </div>

        {/* MENU ICON (MOBILE) */}
        <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </div>

        {/* NAV LINKS */}
        <ul className={menuOpen ? "nav-links active" : "nav-links"}>

          <li>
            <Link to="/" className={isActive("/")} onClick={closeMenu}>
              Home
            </Link>
          </li>

          <li>
            <Link to="/products" className={isActive("/products")} onClick={closeMenu}>
              Products
            </Link>
          </li>

          <li>
            <Link to="/cart" className={isActive("/cart")} onClick={closeMenu}>
              Cart ({cartCount})
            </Link>
          </li>

          {/* USER ROLE BASED */}
          {user?.role === "user" && (
            <>
              <li>
                <Link to="/orders" className={isActive("/orders")} onClick={closeMenu}>
                  My Orders
                </Link>
              </li>
              <li>
                <Link to="/profile" className={isActive("/profile")} onClick={closeMenu}>
                  Profile
                </Link>
              </li>
            </>
          )}

          {user?.role === "farmer" && (
            <li>
              <Link to="/farmer-dashboard" onClick={closeMenu}>
                Dashboard
              </Link>
            </li>
          )}

          {user?.role === "admin" && (
            <li>
              <Link to="/admin-dashboard" onClick={closeMenu}>
                Admin Panel
              </Link>
            </li>
          )}

          {/* AUTH */}
          {!user ? (
            <>
              <li>
                <Link to="/login" onClick={closeMenu}>Login</Link>
              </li>
              <li>
                <Link to="/register" onClick={closeMenu}>Register</Link>
              </li>
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