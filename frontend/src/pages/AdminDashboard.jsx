import { useEffect, useState, useCallback } from "react";
import API from "../services/api";
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

  const fetchProducts = useCallback(async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data || []);
    } catch (err) {
      console.error("Error fetching products", err);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await API.get("/orders");
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

    if (!form.name || !form.price_retail || !form.stock) {
      alert("Please fill all fields");
      return;
    }

    try {
      await API.post("/products", form);

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

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await API.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/orders/${id}`, { status });
      fetchOrders();
    } catch (err) {
      console.error("Update status error", err);
    }
  };

  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
  }

  return (
    <div className="dashboard">
      <h1>Admin Dashboard</h1>

      <div className="card">
        <h2>Add Vegetable</h2>

        <form onSubmit={addProduct} className="form-grid">
          <input name="name" placeholder="Vegetable Name" value={form.name} onChange={handleChange} />
          <input type="number" name="price_retail" placeholder="Retail Price" value={form.price_retail} onChange={handleChange} />
          <input type="number" name="price_wholesale" placeholder="Wholesale Price" value={form.price_wholesale} onChange={handleChange} />
          <input type="number" name="stock" placeholder="Stock" value={form.stock} onChange={handleChange} />
          <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} />

          <button type="submit" className="btn btn-green">
            Add Product
          </button>
        </form>
      </div>

      <div className="card">
        <h2>All Vegetables</h2>

        <div className="product-grid">
          {products.length === 0 ? (
            <p>No products</p>
          ) : (
            products.map((p) => (
              <div key={p._id} className="product-card">
                <img src={p.image || "https://via.placeholder.com/150"} alt={p.name} />
                <h3>{p.name}</h3>
                <p>₹{p.price_retail}</p>

                <button onClick={() => deleteProduct(p._id)} className="btn btn-red">
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
                    <button onClick={() => updateStatus(o._id, "Shipped")} className="btn btn-blue">
                      Ship
                    </button>
                    <button onClick={() => updateStatus(o._id, "Delivered")} className="btn btn-green">
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