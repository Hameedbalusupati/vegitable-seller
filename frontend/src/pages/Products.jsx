import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./Products.css";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const API = "http://localhost:5000/api";

  // ==============================
  // FETCH PRODUCTS
  // ==============================
  const fetchProducts = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/products`);
      setProducts(res.data || []);
    } catch (err) {
      console.error("Error fetching products", err);
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
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("✅ Added to cart");
  };

  // ==============================
  // SEARCH FILTER
  // ==============================
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <h2 className="loading">Loading Products...</h2>;
  }

  return (
    <div className="products-container">
      <h1>🥦 All Vegetables</h1>

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
            <div key={p.id} className="product-card">
              <img
                src={p.image || "https://via.placeholder.com/150"}
                alt={p.name}
              />

              <h3>{p.name}</h3>
              <p className="price">₹{p.price_retail}</p>

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