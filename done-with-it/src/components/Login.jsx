// src/components/Login.jsx
import React, { useState } from "react";
import Colors from "../resources/colors";
import Strings from "../resources/strings"


const backend_uri = Strings.backend_url;

export default function Login({ switchToRegister, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    try {
	const res = await fetch(`${backend_uri}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        onLogin(data); // data now includes phone/location/address
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setError("Network error");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Seller Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} />
      <button style={styles.button} onClick={handleLogin}>Login</button>

      <p style={styles.switchText}>
        Don't have an account?{" "}
        <span style={styles.link} onClick={switchToRegister}>Register</span>
      </p>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 420, margin: "24px auto", padding: 20,
    backgroundColor: Colors.background, borderRadius: 12,
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
    display: "flex", flexDirection: "column", gap: 12,
  },
  title: { textAlign: "center", color: Colors.primary },
  input: { padding: "10px 12px", fontSize: "1rem", borderRadius: 6, border: "1px solid #ccc" },
  button: { padding: "10px 12px", fontSize: "1rem", borderRadius: 6, border: "none", backgroundColor: Colors.primary, color: Colors.textLight, cursor: "pointer" },
  switchText: { textAlign: "center", fontSize: "0.9rem", color: Colors.textDark },
  link: { color: Colors.secondary, cursor: "pointer", textDecoration: "underline" },
};
