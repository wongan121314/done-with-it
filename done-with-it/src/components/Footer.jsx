import React from "react";
import Colors from "../resources/colors";

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <p>© 2025 DoneWithIt. All rights reserved.</p>
      <div style={styles.links}>
        <a href="/report.html">Report an Issue</a>


      </div>
    </footer>
  );
}

const styles = {
  footer: {
    padding: "20px",
    backgroundColor: Colors.gray,
    color: Colors.textLight,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
  },
  links: {
    display: "flex",
    gap: "15px",
    flexWrap: "wrap",
  },
  link: {
    color: Colors.textLight,
    textDecoration: "none",
    fontWeight: "500",
  },
};
