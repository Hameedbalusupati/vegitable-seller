import { useEffect, useState, useCallback } from "react";
import API from "../services/api"; // ✅ USE THIS
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

  // ==============================
  // FETCH PRODUCTS
  // ==============================
  const fetchProducts = useCallback(async () => {
    try {
      const res = await API.get("/products"); // ✅ FIXED
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
      const res = await API.get("/orders"); // ✅ FIXED
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
      await API.post("/products", form); // ✅ FIXED

      alert("✅ Product Added");

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
      await API.delete(`/products/${id}`); // ✅ FIXED
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
      await API.put(`/orders/${id}`, { status }); // ✅ FIXED
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
      <h1>Admin Dashboard 🧑‍💼</h1>

      {/* ADD PRODUCT */}
      <div className="card">
        <h2>Add Vegetable</h2>

        <form onSubmit={addProduct} className="form-grid">
          <input name="name" placeholder="Vegetable Name" value={form.name} onChange={handleChange} required />
          <input type="number" name="price_retail" placeholder="Retail Price" value={form.price_retail} onChange={handleChange} required />
          <input type="number" name="price_wholesale" placeholder="Wholesale Price" value={form.price_wholesale} onChange={handleChange} required />
          <input type="number" name="stock" placeholder="Stock" value={form.stock} onChange={handleChange} required />
          <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} />

          <button type="submit" className="btn btn-green">
            Add Product
          </button>
        </form>
      </div>

      {/* PRODUCTS */}
      <div className="card">
        <h2>All Vegetables</h2>

        <div className="product-grid">
          {products.map((p) => (
            <div key={p.id} className="product-card">
              <img src={p.image || "https://via.placeholder.com/150"} alt={p.name} />
              <h3>{p.name}</h3>
              <p>₹{p.price_retail}</p>

              <button onClick={() => deleteProduct(p.id)} className="btn btn-red">
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ORDERS */}
      <div className="card">
        <h2>Orders</h2>

        <table className="table">
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.user_id}</td>
                <td>₹{o.total_amount}</td>
                <td>{o.status}</td>
                <td>
                  <button onClick={() => updateStatus(o.id, "Shipped")} className="btn btn-blue">
                    Ship
                  </button>
                  <button onClick={() => updateStatus(o.id, "Delivered")} className="btn btn-green">
                    Deliver
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}