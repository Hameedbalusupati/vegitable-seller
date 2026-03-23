import { useEffect, useState, useCallback } from "react";
import API from "../services/api";
import "./Products.css";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // ==============================
  // FETCH PRODUCTS
  // ==============================
  const fetchProducts = useCallback(async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data || []);
    } catch (err) {
      console.error("Error fetching products:", err);

      // 🔥 Handle Render sleep
      if (!err.response) {
        console.log("Backend waking up...");
      } else {
        console.log("Failed to load products");
      }
    }
  }, []);

  // ==============================
  // LOAD DATA
  // ==============================
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchProducts();
      setLoading(false);
    };

    loadData();
  }, [fetchProducts]);

  // ==============================
  // ADD TO CART
  // ==============================
  const addToCart = (product) => {
    try {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      const existing = cart.find((item) => item._id === product._id); // ✅ FIXED

      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      alert("Added to cart");
    } catch (err) {
      console.error("Cart error:", err);
    }
  };

  // ==============================
  // SEARCH FILTER
  // ==============================
  const filteredProducts = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  // ==============================
  // LOADING UI
  // ==============================
  if (loading) {
    return <h2 className="loading">Loading Products...</h2>;
  }

  return (
    <div className="products-container">
      <h1>All Vegetables</h1>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search vegetables..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-box"
      />

      {/* PRODUCTS GRID */}
      <div className="products-grid">
        {filteredProducts.length === 0 ? (
          <p>No vegetables found</p>
        ) : (
          filteredProducts.map((p) => (
            <div key={p._id} className="product-card"> {/* ✅ FIXED */}
              <img
                src={p.image || "https://via.placeholder.com/150"}
                alt={p.name}
              />

              <h3>{p.name}</h3>
              <p className="price">₹{p.price_retail || p.price}</p>

              <button onClick={() => addToCart(p)}>
                Add to Cart
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}