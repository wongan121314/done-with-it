// src/components/ItemCard.jsx
import React from "react";
import Icons from "../resources/icons";
import Colors from "../resources/colors";

const BACKEND_URL = "http://localhost:5000";

export default function ItemCard({ item }) {
  const imageUrl = item.image ? `${BACKEND_URL}/uploads/${item.image}` : "https://picsum.photos/300";
  const getStatusColor = (status) => {
    if (!status) return Colors.gray;
    if (status.toLowerCase() === "available") return Colors.primary;
    if (status.toLowerCase() === "sold") return Colors.danger;
    return Colors.gray;
  };

  return (
    <div style={styles.card}>
      <img src={imageUrl} alt={item.title} style={styles.image} />
      <div style={{ padding: 8 }}>
        <div style={styles.row}><Icons.item style={styles.icon} /><strong>{item.title}</strong></div>
        <div style={styles.row}><Icons.price style={styles.icon} /> ${item.price}</div>
        <div style={styles.row}><Icons.item style={styles.icon} /> {item.category}</div>

        <div style={{ ...styles.status, backgroundColor: getStatusColor(item.status) }}>
          {item.status || "Unknown"}
        </div>

        {/* Seller contact shown publicly */}
        {item.seller_phone && <div style={styles.row}><Icons.phone style={styles.iconSmall} /> {item.seller_phone}</div>}
        {item.seller_email && <div style={styles.row}><Icons.email style={styles.iconSmall} /> {item.seller_email}</div>}
        {item.seller_location && <div style={styles.row}><Icons.location style={styles.iconSmall} /> {item.seller_location}</div>}
        {item.seller_address && <div style={styles.row}><Icons.location style={styles.iconSmall} /> {item.seller_address}</div>}
      </div>
    </div>
  );
}

const styles = {
  card: { width: 240, border: "1px solid #e0e0e0", borderRadius: 10, overflow: "hidden", backgroundColor: "#fff" },
  image: { width: "100%", height: 150, objectFit: "cover" },
  row: { display: "flex", alignItems: "center", gap: 8, fontSize: 14, padding: "4px 0" },
  icon: { color: Colors.primary, fontSize: 18 },
  iconSmall: { color: Colors.primary, fontSize: 14 },
  status: { display: "inline-block", color: Colors.textLight, padding: "6px 8px", borderRadius: 6, marginTop: 6, fontWeight: 600 },
};
