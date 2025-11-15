import React from "react";

const BACKEND_URL = "http://localhost:5000"; // Flask server

export default function ItemCard({ item }) {
  const imageUrl = item.image
    ? `${BACKEND_URL}/uploads/${item.image}` // prepend uploads/
    : "https://picsum.photos/200";

  return (
    <div style={styles.card}>
      <img src={imageUrl} alt={item.title} style={styles.image} />
      <h3>{item.title}</h3>
      <p>${item.price}</p>
      <p>{item.category}</p>
      <p>{item.status}</p>
    </div>
  );
}

const styles = {
  card: {
    width: "200px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    overflow: "hidden",
    padding: "8px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: "150px",
    objectFit: "cover",
    borderRadius: "6px",
  },
};
