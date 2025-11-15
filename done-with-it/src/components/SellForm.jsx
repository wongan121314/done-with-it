// src/components/SellForm.jsx
import React, { useState } from "react";

const BACKEND_URL = "http://localhost:5000";

export default function SellForm({ item = null, sellerId, onSave, onClose }) {
  const [title, setTitle] = useState(item?.title || "");
  const [price, setPrice] = useState(item?.price || "");
  const [status, setStatus] = useState(item?.status || "Available");
  const [category, setCategory] = useState(item?.category || "");
  const [image, setImage] = useState(item?.image || "");
  const [contact, setContact] = useState(item?.contact || "");
  const [email, setEmail] = useState(item?.email || "");
  const [address, setAddress] = useState(item?.address || "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { title, price, status, category, image, contact, email, address, seller_id: sellerId };

    const url = item ? `${BACKEND_URL}/api/items/${item.id}` : `${BACKEND_URL}/api/items`;
    const method = item ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        onSave && onSave({ ...payload, id: item?.id });
      } else {
        alert(data.message || "Error saving item");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving item");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px" }}>
      <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required />
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option>Available</option>
        <option>Sold</option>
      </select>
      <input placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
      <input placeholder="Image URL" value={image} onChange={(e) => setImage(e.target.value)} />
      <input placeholder="Contact" value={contact} onChange={(e) => setContact(e.target.value)} />
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
      <div style={{ display: "flex", gap: "10px" }}>
        <button type="submit">{item ? "Update Item" : "Add Item"}</button>
        {onClose && <button type="button" onClick={onClose}>Cancel</button>}
      </div>
    </form>
  );
}
