// src/components/Login.jsx
import React, { useState } from "react";
import Colors from "../resources/colors";

export default function Login({ switchToRegister, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    const res = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      onLogin(data);
    } else {
      setError(data.message);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Seller Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={styles.input}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={styles.input}
      />
      <button style={styles.button} onClick={handleLogin}>
        Login
      </button>
      <p style={styles.switchText}>
        Don't have an account?{" "}
        <span style={styles.link} onClick={switchToRegister}>
          Register
        </span>
      </p>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "400px",
    margin: "0 auto",
    padding: "20px",
    backgroundColor: Colors.background,
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  title: { textAlign: "center", color: Colors.primary },
  input: {
    padding: "10px 12px",
    fontSize: "1rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px 12px",
    fontSize: "1rem",
    borderRadius: "6px",
    border: "none",
    backgroundColor: Colors.primary,
    color: Colors.textLight,
    cursor: "pointer",
  },
  switchText: { textAlign: "center", fontSize: "0.9rem", color: Colors.textDark },
  link: { color: Colors.secondary, cursor: "pointer", textDecoration: "underline" },
};
