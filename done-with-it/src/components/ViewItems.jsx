// src/components/ViewItems.jsx
import React, { useEffect, useState } from "react";

const BACKEND_URL = "http://localhost:5000";

export default function ViewItems({ sellerId, onEdit }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch seller's items
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BACKEND_URL}/api/items?seller_id=${sellerId}`);
        const data = await res.json();
        setItems(data.items || []);
      } catch (err) {
        console.error("Error fetching items:", err);
      }
      setLoading(false);
    };
    fetchItems();
  }, [sellerId]);

  if (loading) return <p>Loading your items...</p>;

  return (
    <div>
      {items.length === 0 && <p>You have not listed any items yet.</p>}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              border: "1px solid #ccc",
              padding: "12px",
              borderRadius: "8px",
              width: "200px",
            }}
          >
            <img
              src={item.image}
              alt={item.title}
              style={{ width: "100%", height: "120px", objectFit: "cover", borderRadius: "6px" }}
            />
            <h4>{item.title}</h4>
            <p>Price: ${item.price}</p>
            <p>Status: {item.status}</p>
            <p>Category: {item.category}</p>
            <button onClick={() => onEdit(item)}>Edit</button>
          </div>
        ))}
      </div>
    </div>
  );
}
