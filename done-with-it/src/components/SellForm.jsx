// src/components/SellForm.jsx
import React, { useState } from "react";

export default function SellForm({ seller }) {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("Available");
  const [image, setImage] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState(seller.email);
  const [address, setAddress] = useState("");

  const handleAddItem = async () => {
    const res = await fetch("http://<server-ip>:5000/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title, price, category, status, image, contact, email, address, seller_id: seller.id
      }),
    });
    if (res.ok) {
      alert("Item added!");
      setTitle(""); setPrice(""); setCategory(""); setImage(""); setContact(""); setAddress("");
    } else {
      alert("Error adding item");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "10px" }}>
      <h2>Add New Item</h2>
      <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
      <input placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} />
      <input placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} />
      <input placeholder="Status" value={status} onChange={e => setStatus(e.target.value)} />
      <input placeholder="Image URL" value={image} onChange={e => setImage(e.target.value)} />
      <input placeholder="Contact" value={contact} onChange={e => setContact(e.target.value)} />
      <input placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} />
      <button onClick={handleAddItem}>Add Item</button>
    </div>
  );
}
