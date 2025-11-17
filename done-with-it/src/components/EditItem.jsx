import React, { useState } from "react";
const BACKEND_URL = "http://localhost:5000";

export default function EditItem({ item, seller, onCancel, onSave }) {
  const [title, setTitle] = useState(item.title);
  const [price, setPrice] = useState(item.price);
  const [status, setStatus] = useState(item.status);
  const [category, setCategory] = useState(item.category);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState(item.images?.map(i => `${BACKEND_URL}/uploads/${i}`) || []);

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    setImageFiles(files);
    setImagePreviews(files.map(f => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("price", price);
    formData.append("status", status);
    formData.append("category", category);
    formData.append("seller_id", seller.id);
    imageFiles.forEach(f => formData.append("images", f));

    const res = await fetch(`${BACKEND_URL}/api/items/${item.id}`, { method: "PUT", body: formData });
    if (res.ok) {
      const updated = await res.json();
      onSave(updated.item || updated);
    } else {
      alert("Error updating item");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ border: "1px solid #ccc", padding: 12, borderRadius: 8, marginBottom: 16 }}>
      <input type="text" value={title} onChange={e => setTitle(e.target.value)} required placeholder="Title" />
      <input type="number" value={price} onChange={e => setPrice(e.target.value)} required placeholder="Price" />
      <input type="text" value={category} onChange={e => setCategory(e.target.value)} required placeholder="Category" />
      <select value={status} onChange={e => setStatus(e.target.value)}>
        <option value="Available">Available</option>
        <option value="Sold">Sold</option>
      </select>

      <input type="file" accept="image/*" multiple onChange={handleImagesChange} />

      {imagePreviews.length > 0 && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
          {imagePreviews.map((src, idx) => <img key={idx} src={src} alt={`preview-${idx}`} style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 6 }} />)}
        </div>
      )}

      <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
        <button type="submit">Update</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
