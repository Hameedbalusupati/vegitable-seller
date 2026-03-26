import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Logo & About */}
        <div className="footer-section">
          <h2 className="footer-logo">VegMarket</h2>
          <p>
            Fresh vegetables directly from farmers to your home.
            Healthy, organic, and affordable.
          </p>
        </div>

        {/* Navigation */}
        <div className="footer-section">
          <h3>Quick Links</h3>
          <nav>
            <ul>
              <li><Link to="/" aria-label="Go to Home">Home</Link></li>
              <li><Link to="/products" aria-label="View Products">Products</Link></li>
              <li><Link to="/login" aria-label="Login Page">Login</Link></li>
              <li><Link to="/register" aria-label="Register Page">Register</Link></li>
            </ul>
          </nav>
        </div>

        {/* Contact Info */}
        <div className="footer-section">
          <h3>Contact</h3>
          <address>
            <p>Email: <a href="mailto:support@vegmarket.com">support@vegmarket.com</a></p>
            <p>Phone: <a href="tel:+919876543210">+91 9876543210</a></p>
            <p>Location: India</p>
          </address>
        </div>

        {/* Social Links */}
        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a
              href="https://example.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Website"
            >
              🌐
            </a>

            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              📘
            </a>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              📸
            </a>

            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              🐦
            </a>
          </div>
        </div>

      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <p>© {year} VegMarket. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;