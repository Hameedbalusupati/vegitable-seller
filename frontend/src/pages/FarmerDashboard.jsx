import { useState, useEffect, useCallback, useRef } from "react";
import API from "../services/api";
import "./FarmerDashboard.css";

export default function FarmerDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    image: null
  });

  const BASE_URL = import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace("/api", "")
    : "";

  // ==============================
  // FETCH DATA
  // ==============================
  const fetchProducts = useCallback(async () => {
    try {
      const res = await API.get("/products/");
      setProducts(res.data || []);
    } catch {
      alert("Failed to load products");
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await API.get("/orders/");
      setOrders(res.data || []);
    } catch {
      alert("Failed to load orders");
    }
  }, []);

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
    const { name, value, files } = e.target;

    if (name === "image") {
      setForm((prev) => ({ ...prev, image: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ==============================
  // ADD PRODUCT
  // ==============================
  const addProduct = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));

    if (!form.name.trim()) return alert("Enter product name");
    if (!form.price || Number(form.price) <= 0)
      return alert("Enter valid price");
    if (!form.stock || Number(form.stock) <= 0)
      return alert("Enter valid stock");
    if (!form.image) return alert("Select image");

    try {
      setActionLoading(true);

      const formData = new FormData();
      formData.append("name", form.name.trim());
      formData.append("price_per_kg", Number(form.price));
      formData.append("bulk_price", 0);
      formData.append("stock", Number(form.stock));
      formData.append("farmer_id", user?._id || user?.id);
      formData.append("image", form.image);

      await API.post("/products/", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert("✅ Product added");

      setForm({
        name: "",
        price: "",
        stock: "",
        image: null
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      fetchProducts();

    } catch (err) {
      alert(err.response?.data?.message || "Failed ❌");
    } finally {
      setActionLoading(false);
    }
  };

  // ==============================
  // DELETE
  // ==============================
  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      setActionLoading(true);
      await API.delete(`/products/${id}`);
      fetchProducts();
    } catch {
      alert("Delete failed ❌");
    } finally {
      setActionLoading(false);
    }
  };

  // ==============================
  // UPDATE ORDER
  // ==============================
  const updateStatus = async (id, status) => {
    try {
      setActionLoading(true);
      await API.put(`/orders/${id}`, { status });
      fetchOrders();
    } catch {
      alert("Update failed ❌");
    } finally {
      setActionLoading(false);
    }
  };

  // ==============================
  // LOADING
  // ==============================
  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading Dashboard...</h2>;
  }

  return (
    <div className="farmer-dashboard">
      <h1>Farmer Dashboard</h1>

      {/* ADD PRODUCT */}
      <div className="card">
        <h2>Add Your Vegetable</h2>

        <form onSubmit={addProduct} className="form-grid">
          <input name="name" placeholder="Vegetable Name" value={form.name} onChange={handleChange} />
          <input type="number" name="price" placeholder="Price per kg" value={form.price} onChange={handleChange} />
          <input type="number" name="stock" placeholder="Stock" value={form.stock} onChange={handleChange} />

          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            ref={fileInputRef}
          />

          <button type="submit" className="btn btn-green" disabled={actionLoading}>
            {actionLoading ? "Adding..." : "Add Vegetable"}
          </button>
        </form>
      </div>

      {/* PRODUCTS */}
      <div className="card">
        <h2>Your Products</h2>

        <div className="product-grid">
          {products.length === 0 ? (
            <p>No products added</p>
          ) : (
            products.map((p) => (
              <div key={p._id || p.id} className="product-card">
                <img
                  src={
                    p.image
                      ? `${BASE_URL}${p.image}`
                      : "https://via.placeholder.com/150"
                  }
                  alt={p.name}
                />
                <h3>{p.name}</h3>
                <p>₹{p.price_per_kg}</p>
                <p>Stock: {p.stock}</p>

                <button
                  className="btn btn-red"
                  onClick={() => deleteProduct(p._id || p.id)}
                  disabled={actionLoading}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ORDERS */}
      <div className="card">
        <h2>Orders</h2>

        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="5">No orders</td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o._id || o.id}>
                  <td>{o._id || o.id}</td>
                  <td>{o.user_id}</td>
                  <td>₹{o.total_price || o.total_amount}</td>
                  <td>{o.status}</td>
                  <td>
                    <button
                      onClick={() => updateStatus(o._id || o.id, "Packed")}
                      className="btn btn-blue"
                      disabled={actionLoading}
                    >
                      Pack
                    </button>

                    <button
                      onClick={() => updateStatus(o._id || o.id, "Shipped")}
                      className="btn btn-green"
                      disabled={actionLoading}
                      style={{ marginLeft: "5px" }}
                    >
                      Ship
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