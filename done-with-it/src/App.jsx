import React, { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Marketplace from "./components/Marketplace";
import Sell from "./components/Sell";
import About from "./components/About";

export default function App() {
  // State to track which "page" to show
  const [currentPage, setCurrentPage] = useState("marketplace");

  return (
    <div style={styles.appContainer}>
      {/* Pass the state setter to Header so clicking links changes page */}
      <Header setCurrentPage={setCurrentPage} />

      <main style={styles.main}>
        {currentPage === "marketplace" && <Marketplace />}
        {currentPage === "sell" && <Sell />}
        {currentPage === "about" && <About />}
      </main>

      <Footer />
    </div>
  );
}

const styles = {
  appContainer: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: "20px",
    backgroundColor: "#f5f5f5",
  },
};
