// src/components/Sell.jsx
import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import SellForm from "./SellForm";
import ViewItems from "./ViewItems";

export default function Sell() {
  const [showRegister, setShowRegister] = useState(false);
  const [loggedInSeller, setLoggedInSeller] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [addingNew, setAddingNew] = useState(false);

  // Before login: show login/register
  if (!loggedInSeller) {
    return !showRegister ? (
      <Login
        switchToRegister={() => setShowRegister(true)}
        onLogin={(seller) => setLoggedInSeller(seller)}
      />
    ) : (
      <Register
        switchToLogin={() => setShowRegister(false)}
        onRegister={(seller) => setLoggedInSeller(seller)}
      />
    );
  }

  // After login: show seller dashboard
  return (
    <div>
      <h2>Welcome, {loggedInSeller.name}</h2>
      <div style={{ marginBottom: "16px" }}>
        <button onClick={() => setAddingNew(true)}>Add New Item</button>
      </div>

      {addingNew && (
        <SellForm
          sellerId={loggedInSeller.id}
          onSave={() => setAddingNew(false)}
          onClose={() => setAddingNew(false)}
        />
      )}

      {!addingNew && !editingItem && (
        <ViewItems
          sellerId={loggedInSeller.id}
          onEdit={(item) => setEditingItem(item)}
        />
      )}

      {editingItem && (
        <SellForm
          item={editingItem}
          sellerId={loggedInSeller.id}
          onSave={() => setEditingItem(null)}
          onClose={() => setEditingItem(null)}
        />
      )}
    </div>
  );
}
