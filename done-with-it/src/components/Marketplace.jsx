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

  // Fetch items
  useEffect(() => {
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

    fetchItems();
  }, [categoryFilter, sortOrder, currentPage, searchQuery]);

  // Add new item to top of list
  const handleNewItem = (newItem) => {
    setItems((prev) => [newItem, ...prev]);
    if (!allCategories.includes(newItem.category)) {
      setAllCategories((prev) => [...prev, newItem.category]);
    }
  };

  const handlePrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  if (loading) return <p>Loading marketplace items...</p>;

  return (
    <div>
      {/* Filters */}
      <div style={styles.filtersContainer}>
        <input
          type="text"
          placeholder="Search by title..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          style={styles.input}
        />
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
        <span style={{ margin: "0 12px" }}>Page {currentPage} of {totalPages}</span>
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
  },
  input: {
    flex: "1 1 200px",
    padding: "8px",
    fontSize: "1rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
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
