import React from "react";
import "./Loader.css";

const Loader = ({ fullScreen = true, text = "Loading..." }) => {
  return (
    <div className={fullScreen ? "loader-overlay" : "loader-container"}>
      <div className="loader-box">
        <div className="spinner"></div>
        <p className="loader-text">{text}</p>
      </div>
    </div>
  );
};

export default Loader;