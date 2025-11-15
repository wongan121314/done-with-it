// src/components/Register.jsx
import React, { useState } from "react";
import Colors from "../resources/colors";

export default function Register({ switchToLogin, onRegister }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    location: "",
    address: ""
  });
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        onRegister(data); // backend returns created seller (without password)
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      setError("Network error");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Seller Registration</h2>
      {error && <p style={{ color: Colors.danger }}>{error}</p>}

      <input placeholder="Full name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} style={styles.input} />
      <input placeholder="Email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} style={styles.input} />
      <input placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} style={styles.input} />
      <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} style={styles.input} />
      <input placeholder="City / Location" value={form.location} onChange={(e) => setForm({...form, location: e.target.value})} style={styles.input} />
      <input placeholder="Physical address" value={form.address} onChange={(e) => setForm({...form, address: e.target.value})} style={styles.input} />

      <button style={styles.button} onClick={handleRegister}>Register</button>

      <p style={styles.switchText}>
        Already have an account?{" "}
        <span style={styles.link} onClick={switchToLogin}>Login</span>
      </p>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 480, margin: "24px auto", padding: 20,
    backgroundColor: Colors.background, borderRadius: 12,
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
    display: "flex", flexDirection: "column", gap: 10,
  },
  title: { textAlign: "center", color: Colors.primary },
  input: { padding: "10px 12px", fontSize: "1rem", borderRadius: 6, border: "1px solid #ccc" },
  button: { padding: "10px 12px", fontSize: "1rem", borderRadius: 6, border: "none", backgroundColor: Colors.primary, color: Colors.textLight, cursor: "pointer" },
  switchText: { textAlign: "center", fontSize: "0.9rem", color: Colors.textDark },
  link: { color: Colors.secondary, cursor: "pointer", textDecoration: "underline" },
};
