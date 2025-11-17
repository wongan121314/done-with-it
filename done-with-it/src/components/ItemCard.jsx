// src/components/ItemCard.jsx
import React, { useState, useEffect, useCallback } from "react";
import Icons from "../resources/icons";
import Colors from "../resources/colors";

const BACKEND_URL = "http://localhost:5000";

export default function ItemCard({ item }) {
  const [showPreview, setShowPreview] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Build image array: multiple images OR fallback to single image
  const images = item.images?.length
    ? item.images.map(img => `${BACKEND_URL}/uploads/${img}`)
    : [item.image ? `${BACKEND_URL}/uploads/${item.image}` : "https://picsum.photos/600"];

  const nextImg = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images]);

  const prevImg = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images]);

  // Keyboard navigation (left, right, escape)
  useEffect(() => {
    if (!showPreview) return;
    const handleKey = (e) => {
      if (e.key === "ArrowRight") nextImg();
      if (e.key === "ArrowLeft") prevImg();
      if (e.key === "Escape") setShowPreview(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [showPreview, nextImg, prevImg]);

  // Touch swipe detection
  let touchStartX = 0;
  let touchEndX = 0;

  const handleTouchStart = (e) => {
    touchStartX = e.touches[0].screenX;
  };

  const handleTouchEnd = () => {
    if (touchStartX - touchEndX > 50) nextImg();
    if (touchEndX - touchStartX > 50) prevImg();
  };

  const getStatusColor = (status) => {
    if (!status) return Colors.gray;
    if (status.toLowerCase() === "available") return Colors.primary;
    if (status.toLowerCase() === "sold") return Colors.danger;
    return Colors.gray;
  };

  return (
    <>
      {/* Main Item Card */}
      <div style={styles.card}>
        <img
          src={images[0]}
          alt={item.title}
          style={styles.image}
          onClick={() => setShowPreview(true)}
        />

        <div style={{ padding: 12 }}>
          <div style={styles.row}><Icons.item style={styles.icon} /> <strong>{item.title}</strong></div>
          <div style={styles.row}><Icons.price style={styles.icon} /> ${item.price}</div>
          <div style={styles.row}><Icons.item style={styles.icon} /> {item.category}</div>

          <div style={{ ...styles.status, backgroundColor: getStatusColor(item.status) }}>
            {item.status || "Unknown"}
          </div>

          {/* Seller contact */}
          {item.seller_phone && <div style={styles.row}><Icons.phone style={styles.iconSmall} /> {item.seller_phone}</div>}
          {item.seller_email && <div style={styles.row}><Icons.email style={styles.iconSmall} /> {item.seller_email}</div>}
          {item.seller_location && <div style={styles.row}><Icons.location style={styles.iconSmall} /> {item.seller_location}</div>}
          {item.seller_address && <div style={styles.row}><Icons.location style={styles.iconSmall} /> {item.seller_address}</div>}
        </div>
      </div>

      {/* Full-screen swipeable gallery */}
      {showPreview && (
        <div
          style={styles.modal}
          onClick={(e) => {
            // only close when clicking background
            if (e.target === e.currentTarget) setShowPreview(false);
          }}
        >
          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <div style={styles.leftArrow} onClick={prevImg}>❮</div>
              <div style={styles.rightArrow} onClick={nextImg}>❯</div>
            </>
          )}

          <img
            src={images[currentIndex]}
            alt="preview"
            style={styles.fullImage}
            onTouchStart={handleTouchStart}
            onTouchMove={(e) => (touchEndX = e.touches[0].screenX)}
            onTouchEnd={handleTouchEnd}
          />
        </div>
      )}
    </>
  );
}

const styles = {
  card: {
    width: 300,        // Bigger card
    border: "1px solid #e0e0e0",
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#fff",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",   // Soft shadow
    transition: "0.2s",
  },

  image: {
    width: "100%",
    height: 200,        // Bigger image
    objectFit: "cover",
  },

  row: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 15,
    padding: "5px 0",
  },

  icon: { color: Colors.primary, fontSize: 18 },
  iconSmall: { color: Colors.primary, fontSize: 14 },

  status: {
    display: "inline-block",
    color: Colors.textLight,
    padding: "6px 10px",
    borderRadius: 6,
    marginTop: 8,
    fontWeight: 600,
  },

  /* Modal */
  modal: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.9)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },

  fullImage: {
    maxWidth: "95%",
    maxHeight: "95%",
    borderRadius: 10,
    objectFit: "contain",
  },

  /* Navigation Arrows */
  leftArrow: {
    position: "absolute",
    left: "20px",
    fontSize: "50px",
    color: "white",
    cursor: "pointer",
    userSelect: "none",
  },
  rightArrow: {
    position: "absolute",
    right: "20px",
    fontSize: "50px",
    color: "white",
    cursor: "pointer",
    userSelect: "none",
  },
};
