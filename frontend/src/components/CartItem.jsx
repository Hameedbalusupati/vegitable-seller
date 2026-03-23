import React from "react";
import "./CartItem.css";

const CartItem = ({ item, onIncrease, onDecrease, onRemove }) => {
  const {
    id,
    name,
    price_per_kg,
    bulk_price,
    quantity,
    type,
    image
  } = item;

  const price = type === "kg" ? price_per_kg : bulk_price;
  const total = price * quantity;

  return (
    <div className="cart-item">

      {/* Image */}
      <img
        src={image || "https://via.placeholder.com/80"}
        alt={name}
        className="cart-item-img"
      />

      {/* Details */}
      <div className="cart-item-details">
        <h3>{name}</h3>
        <p>Type: {type}</p>
        <p>Price: ₹{price}</p>
      </div>

      {/* Quantity Controls */}
      <div className="cart-item-qty">
        <button onClick={() => onDecrease(id)}>-</button>
        <span>{quantity}</span>
        <button onClick={() => onIncrease(id)}>+</button>
      </div>

      {/* Total */}
      <div className="cart-item-total">
        ₹{total}
      </div>

      {/* Remove */}
      <button className="remove-btn" onClick={() => onRemove(id)}>
        ❌
      </button>

    </div>
  );
};

export default CartItem;