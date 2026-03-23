import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./Order.css";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = "http://localhost:5000/api";

  // ==============================
  // FETCH ORDERS
  // ==============================
  const fetchOrders = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API}/orders/my`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setOrders(res.data || []);
    } catch (err) {
      console.error("Error fetching orders", err);
    }
  }, []);

  // ==============================
  // LOAD DATA
  // ==============================
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchOrders();
      setLoading(false);
    };

    loadData();
  }, [fetchOrders]);

  // ==============================
  // STATUS COLOR
  // ==============================
  const getStatusClass = (status) => {
    if (status === "Pending") return "status pending";
    if (status === "Shipped") return "status shipped";
    if (status === "Delivered") return "status delivered";
    return "status";
  };

  if (loading) {
    return <h2 className="loading">Loading Orders...</h2>;
  }

  return (
    <div className="orders-container">
      <h1>📦 My Orders</h1>

      {orders.length === 0 ? (
        <h2 className="empty">No orders found</h2>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="order-card">
            {/* ORDER HEADER */}
            <div className="order-header">
              <div>
                <p><strong>Order ID:</strong> {order.id}</p>
                <p><strong>Total:</strong> ₹{order.total_amount}</p>
              </div>

              <div className={getStatusClass(order.status)}>
                {order.status}
              </div>
            </div>

            {/* ITEMS */}
            <div className="order-items">
              {order.items && order.items.length > 0 ? (
                order.items.map((item, i) => (
                  <div key={i} className="order-item">
                    <img
                      src={item.image || "https://via.placeholder.com/80"}
                      alt={item.name}
                    />

                    <div>
                      <h4>{item.name}</h4>
                      <p>₹{item.price} × {item.quantity}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p>No items</p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}