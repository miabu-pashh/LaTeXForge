// Resume-FrontEnd/src/pages/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/Login.css"; // optional styling
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5001/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("Login Response:", data);
      if (res.ok) {
        localStorage.setItem("loggedIn", "true");
        setStatus("✅ Login successful!");
        setEmail("");
        setPassword("");
        navigate("/jdinput");
      } else {
        setStatus(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error("Login Error:", err);
      setStatus("❌ Login failed. Try again.");
    }
  };

  return (
    <div className="login-wrapper">
      <img
        src="/imageMe.jpeg"
        alt="Login Illustration"
        className="login-image"
      />
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        {status && <p className="status-msg">{status}</p>}
      </form>
    </div>
  );
}

export default Login;
