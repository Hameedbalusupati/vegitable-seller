import { useEffect, useState } from "react";
import { getProducts } from "../services/productService";
import { useCart } from "../hooks/useCart";
import "./Products.css";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { addToCart } = useCart();

  // ==============================
  // FETCH PRODUCTS (FIXED)
  // ==============================
  const fetchProducts = async () => {
    try {
      setLoading(true);

      const res = await getProducts();

      console.log("Products API:", res);

      // ✅ HANDLE BOTH TYPES
      const data = Array.isArray(res)
        ? res
        : res?.products || [];

      setProducts(data);
      setError("");
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Server is waking up... please retry");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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

  // ==============================
  // ERROR UI
  // ==============================
  if (error) {
    return (
      <div className="products-container">
        <h2>{error}</h2>
        <button onClick={fetchProducts}>Retry</button>
      </div>
    );
  }

  // ==============================
  // UI
  // ==============================
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
          filteredProducts.map((p) => {
            const price =
              p.price_retail ||
              p.price_per_kg ||
              p.price ||
              0;

            return (
              <div key={p._id || p.id} className="product-card">
                <img
                  src={p.image || "https://via.placeholder.com/150"}
                  alt={p.name}
                />

                <h3>{p.name}</h3>

                <p className="price">
                  ₹{Number(price).toFixed(2)}
                </p>

                <button onClick={() => addToCart(p)}>
                  Add to Cart
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}