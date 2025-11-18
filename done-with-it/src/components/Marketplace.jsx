import React, { useEffect, useState } from "react";
import ItemCard from "./ItemCard";

const ITEMS_PER_PAGE = 10;
const BACKEND_URL = "http://localhost:5000";

export default function Marketplace({ onNewItem }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [allCategories, setAllCategories] = useState(["All"]);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch items function
  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/items?category=${categoryFilter}&sort=${sortOrder}&page=${currentPage}&per_page=${ITEMS_PER_PAGE}&search=${encodeURIComponent(searchQuery)}`
      );
      const data = await res.json();
      const fetchedItems = data.items || [];
      setItems(fetchedItems);
      setTotalPages(data.total_pages || 1);

      if (fetchedItems.length > 0) {
        const cats = ["All", ...new Set(fetchedItems.map((i) => i.category))];
        setAllCategories(cats);
      }
    } catch (err) {
      console.error("Error fetching items:", err);
    }
    setLoading(false);
  };

  // Fetch items on category, sort, or page change
  useEffect(() => {
    fetchItems();
  }, [categoryFilter, sortOrder, currentPage]); // searchQuery removed

  const handleNewItem = (newItem) => {
    setItems((prev) => [newItem, ...prev]);
    if (!allCategories.includes(newItem.category)) {
      setAllCategories((prev) => [...prev, newItem.category]);
    }
  };

  const handlePrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  // Manual search triggered by button
  const handleSearch = () => {
    setCurrentPage(1); // triggers fetch via useEffect
  };

  if (loading) return <p>Loading marketplace items...</p>;

  return (
    <div>
      {/* Filters */}
      <div style={styles.filtersContainer}>
        <div style={styles.searchContainer}>
          <span style={styles.searchIcon}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="gray">
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5
              6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5
              4.99L20.49 19l-4.99-5zM9.5 14C7.01 14 5 11.99 5
              9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </span>

          <input
            type="text"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // only updates state
            style={styles.searchInput}
          />

          <button style={styles.searchButton} onClick={handleSearch}>
            Search
          </button>
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={styles.select}
        >
          {allCategories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          style={styles.select}
        >
          <option value="asc">Price: Low → High</option>
          <option value="desc">Price: High → Low</option>
        </select>
      </div>

      {/* Item cards */}
      <div style={styles.itemsContainer}>
        {items.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
        {items.length === 0 && <p>No items found.</p>}
      </div>

      {/* Pagination */}
      <div style={styles.pagination}>
        <button onClick={handlePrev} disabled={currentPage === 1}>Prev</button>
        <span style={{ margin: "0 12px" }}>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={handleNext} disabled={currentPage === totalPages}>Next</button>
      </div>
    </div>
  );
}

const styles = {
  filtersContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    marginBottom: "16px",
    width: "100%",
    justifyContent: "center",
  },

  searchContainer: {
    position: "relative",
    flex: "2 1 300px",
    minWidth: "220px",
  },

  searchIcon: {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    pointerEvents: "none",
  },

  searchInput: {
      width: "60%",
    fontSize: "20px",
    borderRadius: "20px",
    border: "1px solid #43F554",
    boxShadow: "2px 2px 2px gray",
    height: "30px",
    paddingLeft: "11%",
  },

  searchButton: {
    position: "absolute",
    right: "0px",
    top: "0",
    height: "100%",
    border: "none",
    borderRadius: "15px 20px 20px 0",
    backgroundColor: "#ff6a00",
    color: "#fff",
    padding: "0 16px",
    fontSize: "1rem",
    cursor: "pointer",
    margin: "0",
  },

  select: {
    flex: "1 1 150px",
    padding: "8px",
    fontSize: "1rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },

  itemsContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "16px",
    justifyContent: "center",
  },

  pagination: {
    marginTop: "16px",
    textAlign: "center",
  },
};
