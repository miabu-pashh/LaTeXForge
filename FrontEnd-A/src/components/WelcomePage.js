// src/pages/WelcomePage.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/WelcomePage.css"; // Create this CSS file

function WelcomePage() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/login");
  };

  return (
    <div className="welcome-container">
      <h3>HI MAIBU</h3>
      <p className="sub-heading">WITH BLESSINGS FROM</p>
      <h1 className="main-heading">GOD, PARENTS, GURU</h1>
      <button className="hunt-button" onClick={handleClick}>
        lets hunt job
      </button>
    </div>
  );
}

export default WelcomePage;
