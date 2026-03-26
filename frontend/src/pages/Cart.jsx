import { useState, useEffect } from "react";
import API from "../services/api";
import "./Cart.css";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  // ==============================
  // LOAD CART
  // ==============================
  useEffect(() => {
    loadCart();

    // 🔥 Sync with other components
    window.addEventListener("storage", loadCart);

    return () => {
      window.removeEventListener("storage", loadCart);
    };
  }, []);

  const loadCart = () => {
    try {
      const stored = JSON.parse(localStorage.getItem("cart")) || [];
      setCart(stored);
    } catch {
      setCart([]);
    }
  };

  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));

    // 🔥 Important for Navbar update
    window.dispatchEvent(new Event("storage"));
  };

  // ==============================
  // QUANTITY HANDLING
  // ==============================
  const increaseQty = (id) => {
    const updated = cart.map((item) => {
      if (item._id === id) {
        const newQty = item.quantity + 1;

        return {
          ...item,
          quantity: item.stock
            ? Math.min(newQty, item.stock)
            : newQty
        };
      }
      return item;
    });

    updateCart(updated);
  };

  const decreaseQty = (id) => {
    const updated = cart
      .map((item) =>
        item._id === id
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0);

    updateCart(updated);
  };

  const removeItem = (id) => {
    const updated = cart.filter((item) => item._id !== id);
    updateCart(updated);
  };

  // ==============================
  // TOTAL CALCULATION
  // ==============================
  const total = cart.reduce(
    (sum, item) =>
      sum +
      (item.selectedPrice ||
        item.price_retail ||
        item.price ||
        0) *
        item.quantity,
    0
  );

  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  // ==============================
  // CHECKOUT
  // ==============================
  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    try {
      setLoading(true);

      const orderData = {
        items: cart,
        total_amount: total,
      };

      await API.post("/orders", orderData);

      alert("Order placed successfully ✅");

      updateCart([]);
    } catch (err) {
      console.error("Checkout error:", err);

      if (!err.response) {
        alert("Server is starting, try again in a few seconds");
      } else {
        alert("Failed to place order ❌");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cart-container">
      <h1>My Cart</h1>

      {cart.length === 0 ? (
        <h2 className="empty">Your cart is empty</h2>
      ) : (
        <div className="cart-wrapper">

          {/* ================= ITEMS ================= */}
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item._id} className="cart-card">
                <img
                  src={item.image || "https://via.placeholder.com/100"}
                  alt={item.name}
                />

                <div className="details">
                  <h3>{item.name}</h3>
                  <p>
                    ₹{(
                      item.selectedPrice ||
                      item.price_retail ||
                      item.price ||
                      0
                    ).toFixed(2)}
                  </p>

                  <div className="qty">
                    <button
                      onClick={() => decreaseQty(item._id)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() => increaseQty(item._id)}
                      disabled={item.stock && item.quantity >= item.stock}
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => removeItem(item._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ================= SUMMARY ================= */}
          <div className="cart-summary">
            <h2>Price Details</h2>

            <div className="summary-row">
              <span>Total Items</span>
              <span>{totalItems}</span>
            </div>

            <div className="summary-row">
              <span>Total Price</span>
              <span>₹{total.toFixed(2)}</span>
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