import React from "react";
import "./Loader.css";

const Loader = ({ fullScreen = true, text = "Loading..." }) => {
  return (
    <div
      className={fullScreen ? "loader-overlay" : "loader-container"}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="loader-box">
        <div className="spinner" aria-hidden="true"></div>
        <p className="loader-text">{text}</p>
      </div>
    </div>
  );
};

export default Loader;