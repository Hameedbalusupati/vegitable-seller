import React from "react";
import "./CartItem.css";

const CartItem = ({ item, onIncrease, onDecrease, onRemove }) => {
  // Safety check
  if (!item) return null;

  const {
    _id = "",
    name = "Product",
    price_per_kg = 0,
    bulk_price = 0,
    price_retail = 0,
    price = 0,
    quantity = 1,
    type = "kg",
    image = ""
  } = item;

  // Determine unit price
  const unitPrice =
    type === "kg"
      ? price_per_kg || price_retail || price || 0
      : bulk_price || price_retail || price || 0;

  // Ensure quantity is always >= 1
  const safeQuantity = Math.max(1, quantity);

  const total = unitPrice * safeQuantity;

  return (
    <div className="cart-item">

      {/* Product Image */}
      <img
        src={image || "https://via.placeholder.com/80"}
        alt={name}
        className="cart-item-img"
      />

      {/* Details */}
      <div className="cart-item-details">
        <h3>{name}</h3>
        <p>Type: {type}</p>
        <p>Price: ₹{unitPrice.toFixed(2)}</p>
      </div>

      {/* Quantity Controls */}
      <div className="cart-item-qty">
        <button
          onClick={() => onDecrease(_id)}
          disabled={safeQuantity <= 1}
        >
          -
        </button>

        <span>{safeQuantity}</span>

        <button onClick={() => onIncrease(_id)}>
          +
        </button>
      </div>

      {/* Total Price */}
      <div className="cart-item-total">
        ₹{total.toFixed(2)}
      </div>

      {/* Remove Button */}
      <button
        className="remove-btn"
        onClick={() => onRemove(_id)}
      >
        Remove
      </button>

    </div>
  );
};

export default CartItem;