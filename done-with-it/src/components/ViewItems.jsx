import React, { useEffect, useState } from "react";
import Icons from "../resources/icons";
import EditItem from "./EditItem";

const BACKEND_URL = "http://localhost:5000";

export default function ViewItems({ seller }) {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);

  const loadItems = async () => {
    const res = await fetch(`${BACKEND_URL}/api/items?seller_id=${seller.id}`);
    const data = await res.json();
    setItems(data.items || []);
  };

  useEffect(() => { if (seller) loadItems(); }, [seller]);

  if (editing) {
    return <EditItem item={editing} seller={seller} onCancel={() => setEditing(null)} onSave={() => { setEditing(null); loadItems(); }} />;
  }

  return (
    <div style={styles.container}>
      {items.length === 0 && <p>No items yet.</p>}
      {items.map(item => (
        <div key={item.id} style={styles.card}>
          {item.images?.map((img, idx) => (
            <img key={idx} src={`${BACKEND_URL}/uploads/${img}`} alt={`img-${idx}`} style={styles.image} />
          ))}
          <h3 style={styles.row}><Icons.item style={styles.icon} /> {item.title}</h3>
          <p style={styles.row}><Icons.price style={styles.icon} /> ${item.price}</p>
          <p style={styles.row}><Icons.item style={styles.icon} /> {item.category}</p>
          <p style={styles.row}>{item.status}</p>
          <button style={styles.editBtn} onClick={() => setEditing(item)}>Edit</button>
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: { display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center" },
  card: { width: 220, border: "1px solid #ccc", borderRadius: 8, padding: 8, backgroundColor: "#fff" },
  image: { width: "100%", height: 150, objectFit: "cover", borderRadius: 6, marginBottom: 4 },
  row: { display: "flex", alignItems: "center", gap: 6, fontSize: "0.9rem" },
  icon: { color: "#4CAF50" },
  editBtn: { marginTop: 8, padding: "6px 10px", borderRadius: 6, border: "none", backgroundColor: "#FF9800", color: "white", cursor: "pointer" },
};
