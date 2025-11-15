import React, { useEffect, useState } from "react";
import ItemCard from "./ItemCard";

const ITEMS_PER_PAGE = 10;
const BACKEND_URL = "http://localhost:5000"; // Replace with backend IP

export default function Marketplace() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [allCategories, setAllCategories] = useState(["All"]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${BACKEND_URL}/api/items?category=${categoryFilter}&sort=${sortOrder}&page=${currentPage}&per_page=${ITEMS_PER_PAGE}&search=${encodeURIComponent(searchQuery)}`
        );
        const data = await res.json();
        setItems(data.items);
        setTotalPages(data.total_pages);

        // Set categories dynamically
        if (data.items.length > 0) {
          const cats = ["All", ...new Set(data.items.map((i) => i.category))];
          setAllCategories(cats);
        }
      } catch (err) {
        console.error("Error fetching items:", err);
      }
      setLoading(false);
    };

    fetchItems();
  }, [categoryFilter, sortOrder, currentPage, searchQuery]);

  const handlePrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  if (loading) return <p>Loading marketplace items...</p>;

  return (
    <div>
      {/* Filters */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
        <input
          type="text"
          placeholder="Search by title..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
        />
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          {allCategories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="asc">Price: Low → High</option>
          <option value="desc">Price: High → Low</option>
        </select>
      </div>

      {/* Item cards */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
        {items.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
        {items.length === 0 && <p>No items found.</p>}
      </div>

      {/* Pagination */}
      <div style={{ marginTop: "16px", textAlign: "center" }}>
        <button onClick={handlePrev} disabled={currentPage === 1}>Prev</button>
        <span style={{ margin: "0 12px" }}>Page {currentPage} of {totalPages}</span>
        <button onClick={handleNext} disabled={currentPage === totalPages}>Next</button>
      </div>
    </div>
  );
}
