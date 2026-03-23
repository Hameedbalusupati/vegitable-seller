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
    image: ""
  });

  const fetchProducts = useCallback(async () => {
    try {
      const res = await API.get("/farmer/products");
      setProducts(res.data || []);
    } catch (err) {
      console.error("Error fetching products", err);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await API.get("/farmer/orders");
      setOrders(res.data || []);
    } catch (err) {
      console.error("Error fetching orders", err);
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

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const addProduct = async (e) => {
    e.preventDefault();

    if (!form.name || !form.price || !form.stock) {
      alert("Please fill all fields");
      return;
    }

    try {
      await API.post("/farmer/products", form);

      setForm({
        name: "",
        price: "",
        stock: "",
        image: ""
      });

      fetchProducts();
    } catch (err) {
      console.error("Add error:", err);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await API.delete(`/farmer/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/farmer/orders/${id}`, { status });
      fetchOrders();
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading Farmer Data...</h2>;
  }

  return (
    <div className="farmer-dashboard">
      <h1>Farmer Dashboard</h1>

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
            placeholder="Price"
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
            name="image"
            placeholder="Image URL"
            value={form.image}
            onChange={handleChange}
          />

          <button className="btn btn-green">Add Vegetable</button>
        </form>
      </div>

      <div className="card">
        <h2>Your Products</h2>

        <div className="product-grid">
          {products.length === 0 ? (
            <p>No products added</p>
          ) : (
            products.map((p) => (
              <div key={p._id} className="product-card">
                <img
                  src={p.image || "https://via.placeholder.com/150"}
                  alt={p.name}
                />
                <h3>{p.name}</h3>
                <p>₹{p.price}</p>
                <p>Stock: {p.stock}</p>

                <button
                  className="btn btn-red"
                  onClick={() => deleteProduct(p._id)}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>

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
                <tr key={o._id}>
                  <td>{o._id}</td>
                  <td>{o.user_id}</td>
                  <td>₹{o.total_amount}</td>
                  <td>{o.status}</td>
                  <td>
                    <button
                      className="btn btn-blue"
                      onClick={() => updateStatus(o._id, "Packed")}
                    >
                      Pack
                    </button>

                    <button
                      className="btn btn-green"
                      onClick={() => updateStatus(o._id, "Shipped")}
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