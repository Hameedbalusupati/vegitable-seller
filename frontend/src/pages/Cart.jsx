import { useState } from "react";
import "./Cart.css";

export default function Cart() {
  // ✅ FIX: Lazy initialization (NO useEffect needed)
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cart")) || [];
    } catch {
      return [];
    }
  });

  // ==============================
  // UPDATE LOCAL STORAGE
  // ==============================
  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  // ==============================
  // INCREASE QUANTITY
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
  // DECREASE QUANTITY
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
  // TOTAL CALCULATION
  // ==============================
  const total = cart.reduce(
    (sum, item) => sum + item.price_retail * item.quantity,
    0
  );

  // ==============================
  // CHECKOUT
  // ==============================
  const handleCheckout = () => {
    alert("Proceeding to Checkout 🚀");
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
              <span>{cart.length}</span>
            </div>

            <div className="summary-row">
              <span>Total Price</span>
              <span>₹{total}</span>
            </div>

            <button className="checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}