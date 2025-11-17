import React from "react";
import Colors from "../resources/colors";

export default function Header({ setCurrentPage }) {
  return (
    <header style={styles.header}>
      <h1 style={styles.logo}>DoneWithIt</h1>
      <nav style={styles.nav}>
        <button style={styles.link} onClick={() => window.location.href = "/index.html"}>
          Home
        </button>
      </nav>
    </header>
  );
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 24px",
    backgroundColor: Colors.primary,
    color: Colors.textLight,
    flexWrap: "wrap",
  },
  logo: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    margin: "0",
  },
  nav: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
  },
  link: {
    background: "none",
    border: "none",
    color: Colors.textLight,
    fontWeight: "500",
    fontSize: "1rem",
    cursor: "pointer",
  },
};
