import { useState, useEffect, useCallback } from "react";
import API from "../services/api";
import "./FarmerDashboard.css";

export default function FarmerDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    image: null
  });

  const BASE_URL = import.meta.env.VITE_API_URL.replace("/api", "");

  // ==============================
  // FETCH PRODUCTS
  // ==============================
  const fetchProducts = useCallback(async () => {
    try {
      const res = await API.get("/products/");
      setProducts(res.data || []);
    } catch (err) {
      console.error("Fetch Products Error:", err);
    }
  }, []);

  // ==============================
  // FETCH ORDERS
  // ==============================
  const fetchOrders = useCallback(async () => {
    try {
      const res = await API.get("/orders/");
      setOrders(res.data || []);
    } catch (err) {
      console.error("Fetch Orders Error:", err);
    }
  }, []);

  // ==============================
  // LOAD DATA
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
  // HANDLE INPUT CHANGE
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

    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!form.name.trim()) return alert("Enter product name");
      if (!form.price || Number(form.price) <= 0)
        return alert("Enter valid price");
      if (!form.stock || Number(form.stock) <= 0)
        return alert("Enter valid stock");
      if (!form.image) return alert("Select image");

      const formData = new FormData();
      formData.append("name", form.name.trim());
      formData.append("price_per_kg", Number(form.price));
      formData.append("bulk_price", 0);
      formData.append("stock", Number(form.stock));
      formData.append("farmer_id", user?.id || 1);
      formData.append("image", form.image);

      await API.post("/products/", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      alert("✅ Product added successfully");

      setForm({
        name: "",
        price: "",
        stock: "",
        image: null
      });

      document.querySelector('input[name="image"]').value = "";

      fetchProducts();

    } catch (err) {
      console.error("❌ ERROR:", err.response?.data || err);
      alert(err.response?.data?.message || "Failed to add product ❌");
    }
  };

  // ==============================
  // DELETE PRODUCT
  // ==============================
  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await API.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error("Delete Error:", err);
      alert("Failed to delete product");
    }
  };

  // ==============================
  // UPDATE ORDER STATUS
  // ==============================
  const updateStatus = async (id, status) => {
    try {
      await API.put(`/orders/${id}`, { status });
      fetchOrders();
    } catch (err) {
      console.error("Update Status Error:", err);
    }
  };

  // ==============================
  // LOADING
  // ==============================
  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
  }

  return (
    <div className="farmer-dashboard">
      <h1>Farmer Dashboard</h1>

      {/* ADD PRODUCT */}
      <div className="card">
        <h2>Add Your Vegetable</h2>

        <form onSubmit={addProduct} className="form-grid">
          <input
            name="name"
            placeholder="Vegetable Name"
            value={form.name}
            onChange={handleChange}
          />

          <input
            type="number"
            name="price"
            placeholder="Price per kg"
            value={form.price}
            onChange={handleChange}
          />

          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={form.stock}
            onChange={handleChange}
          />

          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
          />

          <button type="submit" className="btn btn-green">
            Add Vegetable
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
              <div key={p.id} className="product-card">
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
                  onClick={() => deleteProduct(p.id)}
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
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>{o.user_id}</td>
                  <td>₹{o.total_price}</td>
                  <td>{o.status}</td>
                  <td>
                    <button
                      onClick={() => updateStatus(o.id, "Packed")}
                      className="btn btn-blue"
                    >
                      Pack
                    </button>

                    <button
                      onClick={() => updateStatus(o.id, "Shipped")}
                      className="btn btn-green"
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