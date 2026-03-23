import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import Footer from "../components/Footer";
import "./Home.css";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async (retry = 0) => {
    try {
      const res = await API.get("/products");
      setProducts(res.data || []);
      setError("");
    } catch (err) {
      console.log("Fetch error:", err);

      // 🔥 Retry logic (IMPORTANT)
      if (retry < 3) {
        setTimeout(() => {
          fetchProducts(retry + 1);
        }, 5000); // retry after 5 sec
      } else {
        setError("Server is waking up... please click retry");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addToCart = (product) => {
    try {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      const existing = cart.find((item) => item._id === product._id);

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

  const filteredProducts = products.filter((p) =>
    p.name && p.name.toLowerCase().includes(search.toLowerCase())
  );

  // ==============================
  // LOADING UI
  // ==============================
  if (loading) {
    return (
      <h2 style={{ textAlign: "center", marginTop: "50px" }}>
        Loading Products...
      </h2>
    );
  }

  // ==============================
  // ERROR UI
  // ==============================
  if (error) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>{error}</h2>

        <button
          onClick={() => {
            setLoading(true);
            setError("");
            fetchProducts();
          }}
          style={{
            padding: "10px 20px",
            marginTop: "10px",
            cursor: "pointer"
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="home">

      <div className="navbar">
        <h2>VeggieMart</h2>

        <input
          type="text"
          placeholder="Search vegetables..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="nav-links">
          <Link to="/cart">Cart</Link>
          <Link to="/login">Login</Link>
        </div>
      </div>

      <div className="hero">
        <h1>Fresh Vegetables Delivered to Your Door</h1>
        <p>Farm fresh veggies at best price</p>
      </div>

      <div className="product-section">
        <h2>Fresh Vegetables</h2>

        <div className="product-grid">
          {filteredProducts.length === 0 ? (
            <p>No products found</p>
          ) : (
            filteredProducts.map((p) => (
              <div key={p._id} className="product-card">
                <img
                  src={p.image || "https://via.placeholder.com/150"}
                  alt={p.name}
                />
                <h3>{p.name}</h3>
                <p>₹{p.price_retail || p.price}</p>

                <button onClick={() => addToCart(p)}>
                  Add to Cart
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}