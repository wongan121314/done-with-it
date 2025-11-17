// src/components/SellForm.jsx
import React, { useState } from "react";
import Icons from "../resources/icons";                                 
const BACKEND_URL = "http://localhost:5000";

const CATEGORIES = [
  "Electronics",
  "Clothing",
  "Books",
  "Furniture",
  "Toys",
  "Sports",
  "Music",
  "Tools",
  "Other"
];

export default function SellForm({ seller, onNewItem }) {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("Available");
  const [category, setCategory] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Handle multiple images
  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5); // max 5
    setImageFiles(files);
    setImagePreviews(files.map(f => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!seller?.id) { alert("Login required"); return; }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("price", price);
    formData.append("status", status);
    formData.append("category", category);
    formData.append("seller_id", seller.id);
    formData.append("contact", seller.phone || "");
    formData.append("email", seller.email || "");
    formData.append("address", seller.address || "");
    formData.append("location", seller.location || "");

    imageFiles.forEach(f => formData.append("images", f)); // append multiple images

    try {
      const res = await fetch(`${BACKEND_URL}/api/items`, { method: "POST", body: formData });
      if (res.ok) {
        const newItem = await res.json();
        onNewItem && onNewItem(newItem);
        // reset form
        setTitle(""); setPrice(""); setCategory(""); setStatus("Available");
        setImageFiles([]); setImagePreviews([]);
       } else {
        const data = await res.json();
        alert(data.message || "Error adding item");
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <label style={styles.label}><Icons.item style={styles.icon} /> Title
        <input value={title} onChange={(e) => setTitle(e.target.value)} required />
      </label>

      <label style={styles.label}><Icons.price style={styles.icon} /> Price
        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
      </label>

      <label style={styles.label}><Icons.item style={styles.icon} /> Category
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Select category</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </label>

      <label style={styles.label}>Status
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Available">Available</option>
          <option value="Sold">Sold</option>
        </select>
      </label>

      <label style={styles.label}>Images (up to 5)
        <input type="file" accept="image/*" multiple  onChange={handleImagesChange} />
      </label>

      {/* Image previews */}
      {imagePreviews.length > 0 && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {imagePreviews.map((src, idx) => (
            <img key={idx} src={src} alt={`preview-${idx}`} style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 6 }} />
          ))}
        </div>
      )}

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button type="submit">Add Item</button>
      </div>
    </form>
  );
}

const styles = {
  form: { display: "flex", flexDirection: "column", gap: 12, maxWidth: 520, margin: "0 auto" },
  label: { display: "flex", flexDirection: "column", gap: 6, fontSize: 14 },
  icon: { color: "#4CAF50", marginRight: 6 },
};
