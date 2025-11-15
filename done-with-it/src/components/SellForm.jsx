import React, { useState } from "react";

export default function SellForm({ seller, onNewItem }) {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("Available");
  const [category, setCategory] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // For preview

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // Preview
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("price", price);
    formData.append("status", status);
    formData.append("category", category);
    formData.append("seller_id", seller.id);
    if (imageFile) formData.append("image", imageFile);

    const res = await fetch("http://localhost:5000/api/items", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const newItem = await res.json();
      onNewItem(newItem); // Update marketplace instantly

      // Reset form and preview
      setTitle("");
      setPrice("");
      setCategory("");
      setStatus("Available");
      setImageFile(null);
      setImagePreview(null);
    } else {
      alert("Error adding item.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        maxWidth: "400px",
        margin: "0 auto",
      }}
    >
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
      />
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="Available">Available</option>
        <option value="Sold">Sold</option>
      </select>
      <input type="file" accept="image/*" onChange={handleImageChange} />

      {/* Image preview */}
      {imagePreview && (
        <img
          src={imagePreview}
          alt="Preview"
          style={{ width: "100%", maxHeight: "200px", objectFit: "cover", borderRadius: "8px" }}
        />
      )}

      <button type="submit">Add Item</button>
    </form>
  );
}
