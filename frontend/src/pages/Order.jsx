import { useEffect, useState, useCallback } from "react";
import API from "../services/api";
import "./Order.css";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==============================
  // FETCH ORDERS (WITH RETRY)
  // ==============================
  const fetchOrders = useCallback(async (retry = 0) => {
    try {
      const res = await API.get("/orders/my");
      setOrders(res.data || []);
      setError("");
    } catch (err) {
      console.error("Error fetching orders:", err);

      if (retry < 3) {
        setTimeout(() => {
          fetchOrders(retry + 1);
        }, 4000);
      } else {
        setError("Server is waking up... please retry");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // ==============================
  // STATUS STYLE
  // ==============================
  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "status pending";
      case "Packed":
        return "status packed";
      case "Shipped":
        return "status shipped";
      case "Delivered":
        return "status delivered";
      default:
        return "status";
    }
  };

  // ==============================
  // LOADING
  // ==============================
  if (loading) {
    return <h2 className="loading">Loading Orders...</h2>;
  }

  // ==============================
  // ERROR UI
  // ==============================
  if (error) {
    return (
      <div className="orders-container">
        <h2>{error}</h2>
        <button onClick={() => {
          setLoading(true);
          setError("");
          fetchOrders();
        }}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <h1>My Orders</h1>

      {orders.length === 0 ? (
        <h2 className="empty">No orders found</h2>
      ) : (
        orders.map((order) => (
          <div key={order._id || order.id} className="order-card">

            {/* HEADER */}
            <div className="order-header">
              <div>
                <p><strong>Order ID:</strong> {(order._id || "").slice(0, 8)}...</p>
                <p><strong>Total:</strong> ₹{(order.total_amount || 0).toFixed(2)}</p>
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
                      <p>
                        ₹{(
                          item.selectedPrice ||
                          item.price ||
                          item.price_retail ||
                          0
                        ).toFixed(2)} × {item.quantity}
                      </p>
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