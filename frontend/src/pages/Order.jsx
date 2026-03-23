import { useEffect, useState, useCallback } from "react";
import API from "../services/api";
import "./Order.css";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await API.get("/orders/my");
      setOrders(res.data || []);
    } catch (err) {
      console.error("Error fetching orders:", err);

      if (!err.response) {
        console.log("Backend waking up...");
      } else {
        console.log("Failed to load orders");
      }
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchOrders();
      setLoading(false);
    };

    loadData();
  }, [fetchOrders]);

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

  if (loading) {
    return <h2 className="loading">Loading Orders...</h2>;
  }

  return (
    <div className="orders-container">
      <h1>My Orders</h1>

      {orders.length === 0 ? (
        <h2 className="empty">No orders found</h2>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="order-card">

            <div className="order-header">
              <div>
                <p><strong>Order ID:</strong> {order._id}</p>
                <p><strong>Total:</strong> ₹{order.total_amount}</p>
              </div>

              <div className={getStatusClass(order.status)}>
                {order.status}
              </div>
            </div>

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
                        ₹{item.price || item.price_retail} x {item.quantity}
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