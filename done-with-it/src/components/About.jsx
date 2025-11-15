import React from "react";
import Colors from "../resources/colors";

export default function About() {
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>About DoneWithIt</h2>
      <p style={styles.text}>
        DoneWithIt is a platform for buying and selling used items. Sellers can list
        their products and buyers can browse, filter, and purchase items easily.
      </p>
      <p style={styles.text}>
        Our mission is to make second-hand trading simple, safe, and enjoyable for
        everyone.
      </p>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
    backgroundColor: Colors.white,
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  title: {
    fontSize: "1.8rem",
    color: Colors.primary,
    marginBottom: "16px",
  },
  text: {
    fontSize: "1rem",
    lineHeight: "1.6rem",
    color: Colors.textDark,
    marginBottom: "12px",
  },
};
