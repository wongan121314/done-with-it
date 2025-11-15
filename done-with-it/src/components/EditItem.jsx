// src/components/EditItem.jsx
import React from "react";
import SellForm from "./SellForm";

export default function EditItem({ item, onClose, onSave, sellerId }) {
  return (
    <div>
      <h3>Edit Item</h3>
      <SellForm item={item} onClose={onClose} onSave={onSave} sellerId={sellerId} />
    </div>
  );
}
