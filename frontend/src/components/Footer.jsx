import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-section">
          <h2 className="footer-logo">VegMarket</h2>
          <p>
            Fresh vegetables directly from farmers to your home.
            Healthy, organic, and affordable.
          </p>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact</h3>
          <p>Email: support@vegmarket.com</p>
          <p>Phone: +91 9876543210</p>
          <p>Location: India</p>
        </div>

        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="https://example.com" target="_blank" rel="noopener noreferrer">🌐</a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">📘</a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">📸</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">🐦</a>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© {year} VegMarket. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;