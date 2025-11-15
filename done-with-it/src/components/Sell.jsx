// src/components/Sell.jsx
import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import SellForm from "./SellForm";

export default function Sell() {
  const [showRegister, setShowRegister] = useState(false);
  const [loggedInSeller, setLoggedInSeller] = useState(null);

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

  return <SellForm seller={loggedInSeller} />;
}
