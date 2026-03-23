import React from "react";
import "./Loader.css";

const Loader = ({ fullScreen = true, text }) => {
  const displayText = text || "Loading...";

  return (
    <div
      className={fullScreen ? "loader-overlay" : "loader-container"}
      role="status"
      aria-live="polite"
    >
      <div className="loader-box">
        <div className="spinner"></div>
        <p className="loader-text">{displayText}</p>
      </div>
    </div>
  );
};

export default Loader;