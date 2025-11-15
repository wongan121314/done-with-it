// src/components/Sell.jsx
import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import SellForm from "./SellForm";
import ViewItems from "./ViewItems";

export default function Sell() {
  const [showRegister, setShowRegister] = useState(false);
  const [loggedInSeller, setLoggedInSeller] = useState(null);
  const [view, setView] = useState("viewItems"); // "viewItems" or "sellForm"

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
    <div style={{ padding: "16px" }}>
      {/* Buttons to switch views */}
      <div style={{ marginBottom: "16px", display: "flex", gap: "12px" }}>
        <button
          onClick={() => setView("viewItems")}
          disabled={view === "viewItems"}
        >
          My Items
        </button>
        <button
          onClick={() => setView("sellForm")}
          disabled={view === "sellForm"}
        >
          Add Item
        </button>
      </div>

      {/* Conditional rendering */}
      {view === "viewItems" && (
        <ViewItems seller={loggedInSeller} />
      )}
      {view === "sellForm" && (
        <SellForm
          seller={loggedInSeller}
          onNewItem={() => setView("viewItems")} // go back to view after adding
        />
      )}
    </div>
  );
}
