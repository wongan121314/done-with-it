// src/components/SellForm.jsx
import React, { useState } from "react";
import Icons from "../resources/icons";

const BACKEND_URL = "http://localhost:5000";

const CATEGORY_OPTIONS = [
  "Electronics",
  "Furniture",
  "Clothing",
  "Appliances",
  "Tools",
  "Vehicles",
  "Books",
  "Sports",
  "Kids & Toys",
  "Health & Beauty",
  "Collectibles",
  "Garden",
  "Free Stuff",
  "Other"
];

export default function SellForm({ seller, onNewItem }) {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("Available");
  const [category, setCategory] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setImageFile(f);
      setImagePreview(URL.createObjectURL(f));
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
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

    // attach seller contact info into item row (public)
    formData.append("contact", seller.phone || "");
    formData.append("email", seller.email || "");
    formData.append("address", seller.address || "");
    formData.append("location", seller.location || "");

    if (imageFile) formData.append("image", imageFile);

    try {
      const res = await fetch(`${BACKEND_URL}/api/items`, { method: "POST", body: formData });
      if (res.ok) {
        const newItem = await res.json();
        onNewItem && onNewItem(newItem);

        // reset form
        setTitle("");
        setPrice("");
        setCategory("");
        setStatus("Available");
        setImageFile(null);
        setImagePreview(null);
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
      <label style={styles.label}>
        <Icons.item style={styles.icon} /> Title
        <input value={title} onChange={(e) => setTitle(e.target.value)} required />
      </label>

      <label style={styles.label}>
        <Icons.price style={styles.icon} /> Price
        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
      </label>

      <label style={styles.label}>
        <Icons.item style={styles.icon} /> Category
        <select value={category} onChange={(e) => setCategory(e.target.value)} required>
          <option value="">Select a category</option>
          {CATEGORY_OPTIONS.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </label>

      <label style={styles.label}>
        Status
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Available">Available</option>
          <option value="Sold">Sold</option>
        </select>
      </label>

      <label style={styles.label}>
        Image
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </label>

      {imagePreview && (
        <img src={imagePreview} alt="preview" style={styles.preview} />
      )}

      <div style={{ display: "flex", gap: 8 }}>
        <button type="submit">Add Item</button>
      </div>
    </form>
  );
}

const styles = {
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    maxWidth: 520,
    margin: "0 auto"
  },
  label: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    fontSize: 14
  },
  icon: {
    color: "#4CAF50",
    marginRight: 6
  },
  preview: {
    width: "100%",
    maxHeight: 240,
    objectFit: "cover",
    borderRadius: 8
  }
};
