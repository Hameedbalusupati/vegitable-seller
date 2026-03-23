import { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  const API = "http://localhost:5000/api";

  // ==============================
  // FETCH PRODUCTS (SAFE FIX)
  // ==============================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API}/products`);
        setProducts(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

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

  return (
    <div className="home">
      {/* NAVBAR */}
      <div className="navbar">
        <h2>🥬 VeggieMart</h2>

        <input
          type="text"
          placeholder="Search vegetables..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="nav-links">
          <a href="/cart">Cart 🛒</a>
          <a href="/login">Login</a>
        </div>
      </div>

      {/* HERO */}
      <div className="hero">
        <h1>Fresh Vegetables Delivered to Your Door 🚚</h1>
        <p>Farm fresh veggies at best price</p>
      </div>

      {/* PRODUCTS */}
      <div className="product-section">
        <h2>Fresh Vegetables</h2>

        <div className="product-grid">
          {filteredProducts.length === 0 ? (
            <p>No products found</p>
          ) : (
            filteredProducts.map((p) => (
              <div key={p.id} className="product-card">
                <img
                  src={p.image || "https://via.placeholder.com/150"}
                  alt={p.name}
                />

                <h3>{p.name}</h3>
                <p>₹{p.price_retail}</p>

                <button onClick={() => addToCart(p)}>
                  Add to Cart
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}