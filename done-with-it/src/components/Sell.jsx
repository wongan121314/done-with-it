// src/components/Sell.jsx
import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import SellForm from "./SellForm";
import Marketplace from "./Marketplace";
import ViewItems from "./ViewItems"

export default function Sell() {
  const [showRegister, setShowRegister] = useState(false);
  const [loggedInSeller, setLoggedInSeller] = useState(null);
  const [newItems, setNewItems] = useState([]);

  // Called by SellForm to add a new item
  const handleNewItem = (item) => {
    setNewItems((prev) => [item, ...prev]);
  };

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

  return (
    <div>
      {/* Sell Form */}
      <SellForm seller={loggedInSeller} onNewItem={handleNewItem} />

 
    </div>
  );
}
