import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    price_retail: "",
    price_wholesale: "",
    stock: "",
    image: ""
  });

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
  // FETCH ORDERS
  // ==============================
  const fetchOrders = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/orders`);
      setOrders(res.data || []);
    } catch (err) {
      console.error("Error fetching orders", err);
    }
  }, []);

  // ==============================
  // LOAD DATA (FIXED)
  // ==============================
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchProducts(), fetchOrders()]);
      setLoading(false);
    };

    loadData();
  }, [fetchProducts, fetchOrders]);

  // ==============================
  // HANDLE INPUT
  // ==============================
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // ==============================
  // ADD PRODUCT
  // ==============================
  const addProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/products`, form);

      alert("✅ Product Added Successfully");

      setForm({
        name: "",
        price_retail: "",
        price_wholesale: "",
        stock: "",
        image: ""
      });

      fetchProducts();
    } catch (err) {
      console.error("Add product error", err);
    }
  };

  // ==============================
  // DELETE PRODUCT
  // ==============================
  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await axios.delete(`${API}/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  // ==============================
  // UPDATE ORDER STATUS
  // ==============================
  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${API}/orders/${id}`, { status });
      fetchOrders();
    } catch (err) {
      console.error("Update status error", err);
    }
  };

  // ==============================
  // LOADING UI
  // ==============================
  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
  }

  return (
    <div className="dashboard">
      <h1>Admin Dashboard 🧑‍💼</h1>

      {/* ================= ADD PRODUCT ================= */}
      <div className="card">
        <h2>Add Vegetable</h2>

        <form onSubmit={addProduct} className="form-grid">
          <input
            type="text"
            name="name"
            placeholder="Vegetable Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="price_retail"
            placeholder="Retail Price"
            value={form.price_retail}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="price_wholesale"
            placeholder="Wholesale Price"
            value={form.price_wholesale}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={form.stock}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="image"
            placeholder="Image URL"
            value={form.image}
            onChange={handleChange}
          />

          <button type="submit" className="btn btn-green">
            Add Product
          </button>
        </form>
      </div>

      {/* ================= PRODUCTS ================= */}
      <div className="card">
        <h2>All Vegetables</h2>

        <div className="product-grid">
          {products.length === 0 ? (
            <p>No products available</p>
          ) : (
            products.map((p) => (
              <div key={p.id} className="product-card">
                <img
                  src={p.image || "https://via.placeholder.com/150"}
                  alt={p.name}
                />
                <h3>{p.name}</h3>
                <p>Retail: ₹{p.price_retail}</p>
                <p>Wholesale: ₹{p.price_wholesale}</p>
                <p>Stock: {p.stock}</p>

                <button
                  onClick={() => deleteProduct(p.id)}
                  className="btn btn-red"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ================= ORDERS ================= */}
      <div className="card">
        <h2>Orders</h2>

        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="5">No orders</td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>{o.user_id}</td>
                  <td>₹{o.total_amount}</td>
                  <td>{o.status}</td>
                  <td>
                    <button
                      onClick={() => updateStatus(o.id, "Shipped")}
                      className="btn btn-blue"
                    >
                      Ship
                    </button>

                    <button
                      onClick={() => updateStatus(o.id, "Delivered")}
                      className="btn btn-green"
                      style={{ marginLeft: "5px" }}
                    >
                      Deliver
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}