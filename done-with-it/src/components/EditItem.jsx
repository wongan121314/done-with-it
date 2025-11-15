// src/components/EditItem.jsx
import React, { useState } from "react";

const BACKEND_URL = "http://localhost:5000";

export default function EditItem({ item, onUpdate, onCancel }) {
  const [title, setTitle] = useState(item.title);
  const [price, setPrice] = useState(item.price);
  const [status, setStatus] = useState(item.status);
  const [category, setCategory] = useState(item.category);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    item.image ? `${BACKEND_URL}/uploads/${item.image}` : null
  );

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("price", price);
    formData.append("status", status);
    formData.append("category", category);
    formData.append("seller_id", item.seller_id);
    if (imageFile) formData.append("image", imageFile);

    const res = await fetch(`${BACKEND_URL}/api/items/${item.id}`, {
      method: "PUT",
      body: formData,
    });

    if (res.ok) {
      const updatedItem = await res.json();
      onUpdate(updatedItem.item); // update parent list
    } else {
      alert("Error updating item.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        border: "1px solid #ccc",
        padding: "12px",
        marginBottom: "16px",
        borderRadius: "8px",
      }}
    >
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        placeholder="Title"
      />
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
        placeholder="Price"
      />
      <input
        type="text"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
        placeholder="Category"
      />
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="Available">Available</option>
        <option value="Sold">Sold</option>
      </select>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {imagePreview && (
        <img
          src={imagePreview}
          alt="Preview"
          style={{ width: "100%", maxHeight: "200px", objectFit: "cover", marginTop: "8px" }}
        />
      )}
      <div style={{ marginTop: "8px", display: "flex", gap: "8px" }}>
        <button type="submit">Update</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
