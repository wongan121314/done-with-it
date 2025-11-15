import React from "react";
import Icons from "../resources/icons";
import Colors from "../resources/colors";

const BACKEND_URL = "http://localhost:5000";

export default function ItemCard({ item }) {
  const imageUrl = item.image ? `${BACKEND_URL}/uploads/${item.image}` : "https://picsum.photos/200";

  const getStatusColor = (status) => {
    if (status === "Available") return Colors.primary;
    if (status === "Sold") return Colors.danger;
    return Colors.gray;
  };

  return (
    <div style={styles.card}>
      <img src={imageUrl} alt={item.title} style={styles.image} />

      <h3 style={styles.row}><Icons.item style={styles.icon} /> {item.title}</h3>
      <p style={styles.row}><Icons.price style={styles.icon} /> ${item.price}</p>
      <p style={styles.row}><Icons.item style={styles.icon} /> {item.category}</p>
      <p style={{ ...styles.row, color: getStatusColor(item.status), fontWeight: "bold" }}>{item.status}</p>

      {item.contact && <p style={styles.row}><Icons.phone style={styles.icon} /> {item.contact}</p>}
      {item.email && <p style={styles.row}><Icons.email style={styles.icon} /> {item.email}</p>}
      {item.address && <p style={styles.row}><Icons.location style={styles.icon} /> {item.address}</p>}
    </div>
  );
}

const styles = {
  card: {
    width: "220px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    overflow: "hidden",
    padding: "8px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: "150px",
    objectFit: "cover",
    borderRadius: "6px",
  },
  row: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "0.9rem",
  },
  icon: {
    color: Colors.primary,
  },
};
