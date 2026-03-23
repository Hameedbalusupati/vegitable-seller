import { useState } from "react";
import API from "../services/api"; // ✅ backend connection
import "./Cart.css";

export default function Cart() {
  // ==============================
  // LOAD CART (SAFE)
  // ==============================
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cart")) || [];
    } catch {
      return [];
    }
  });

  const [loading, setLoading] = useState(false);

  // ==============================
  // UPDATE CART
  // ==============================
  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  // ==============================
  // INCREASE QTY
  // ==============================
  const increaseQty = (id) => {
    const updated = cart.map((item) =>
      item.id === id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    updateCart(updated);
  };

  // ==============================
  // DECREASE QTY
  // ==============================
  const decreaseQty = (id) => {
    const updated = cart
      .map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0);

    updateCart(updated);
  };

  // ==============================
  // REMOVE ITEM
  // ==============================
  const removeItem = (id) => {
    const updated = cart.filter((item) => item.id !== id);
    updateCart(updated);
  };

  // ==============================
  // TOTAL PRICE
  // ==============================
  const total = cart.reduce(
    (sum, item) => sum + item.price_retail * item.quantity,
    0
  );

  // ==============================
  // TOTAL ITEMS COUNT
  // ==============================
  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  // ==============================
  // CHECKOUT (API CALL)
  // ==============================
  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("Cart is empty ❌");
      return;
    }

    try {
      setLoading(true);

      const orderData = {
        items: cart,
        total_amount: total,
      };

      await API.post("/orders", orderData);

      alert("✅ Order placed successfully!");

      // Clear cart
      updateCart([]);

    } catch (err) {
      console.error("Checkout error:", err);
      alert("❌ Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cart-container">
      <h1>🛒 My Cart</h1>

      {cart.length === 0 ? (
        <h2 className="empty">Your cart is empty</h2>
      ) : (
        <div className="cart-wrapper">

          {/* LEFT SIDE */}
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.id} className="cart-card">
                <img
                  src={item.image || "https://via.placeholder.com/100"}
                  alt={item.name}
                />

                <div className="details">
                  <h3>{item.name}</h3>
                  <p>₹{item.price_retail}</p>

                  <div className="qty">
                    <button onClick={() => decreaseQty(item.id)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => increaseQty(item.id)}>+</button>
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => removeItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT SIDE */}
          <div className="cart-summary">
            <h2>Price Details</h2>

            <div className="summary-row">
              <span>Total Items</span>
              <span>{totalItems}</span>
            </div>

            <div className="summary-row">
              <span>Total Price</span>
              <span>₹{total}</span>
            </div>

            <button
              className="checkout-btn"
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? "Processing..." : "Proceed to Checkout"}
            </button>
          </div>

        </div>
      )}
    </div>
  );
}