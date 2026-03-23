import { useEffect, useState } from "react";
import API from "../services/api";
import Footer from "../components/Footer"; // ✅ ADDED
import "./Home.css";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/products");
        setProducts(res.data || []);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const addToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find((item) => item._id === product._id); // ✅ FIXED

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("✅ Added to cart");
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <h2 style={{ textAlign: "center" }}>⏳ Loading Products...</h2>;
  }

  return (
    <div className="home">

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

      <div className="hero">
        <h1>Fresh Vegetables Delivered to Your Door 🚚</h1>
        <p>Farm fresh veggies at best price</p>
      </div>

      <div className="product-section">
        <h2>Fresh Vegetables</h2>

        <div className="product-grid">
          {filteredProducts.length === 0 ? (
            <p>No products found</p>
          ) : (
            filteredProducts.map((p) => (
              <div key={p._id} className="product-card"> {/* ✅ FIXED */}
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

      {/* ✅ FOOTER ADDED */}
      <Footer />

    </div>
  );
}