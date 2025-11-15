// src/components/Register.jsx
import React, { useState } from "react";
import Colors from "../resources/colors";

export default function Register({ switchToLogin, onRegister }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    const res = await fetch("http://localhost:5000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      onRegister({ id: data.id, name, email });
    } else {
      setError(data.message);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Register</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} style={styles.input} />
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={styles.input} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={styles.input} />
      <button style={styles.button} onClick={handleRegister}>Register</button>
      <p style={styles.switchText}>
        Already have an account? <span style={styles.link} onClick={switchToLogin}>Login</span>
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

