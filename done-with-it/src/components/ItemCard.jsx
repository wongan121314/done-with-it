// src/components/ItemCard.jsx
import React from "react";
import Colors from "../resources/colors";
import Icons from "../resources/icons";

export default function ItemCard({ item }) {
  const statusColor = item.status === "Available" ? Colors.primary : Colors.danger;

  return (
    <div style={styles.card}>
      <img src={item.image} alt={item.title} style={styles.img} />
      <h3 style={styles.title}>{item.title}</h3>
      <p style={styles.text}>Price: ${item.price}</p>
      <p style={{ ...styles.status, backgroundColor: statusColor }}>{item.status}</p>
      <div style={styles.contactContainer}>
        <div style={styles.contactItem}>
          <Icons.phone /> {item.contact}
        </div>
        <div style={styles.contactItem}>
          <Icons.email /> {item.email}
        </div>
        <div style={styles.contactItem}>
          <Icons.location /> {item.address}
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    border: "1px solid #ccc",
    borderRadius: "10px",
    padding: "12px",
    flex: "1 1 220px", // grow/shrink, min width 220px
    maxWidth: "300px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    backgroundColor: Colors.background,
  },
  img: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
    borderRadius: "8px",
  },
  title: {
    margin: "0",
    fontSize: "1.1rem",
    color: Colors.textDark,
  },
  text: {
    margin: "0",
    fontSize: "0.95rem",
    color: Colors.textDark,
  },
  status: {
    padding: "4px 8px",
    borderRadius: "6px",
    color: Colors.textLight,
    display: "inline-block",
    fontSize: "0.85rem",
    width: "fit-content",
  },
  contactContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    fontSize: "0.85rem",
    color: Colors.textDark,
  },
  contactItem: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    wordBreak: "break-word", // prevents overflow
  },
};
