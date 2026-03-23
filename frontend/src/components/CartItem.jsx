import React from "react";
import "./CartItem.css";

const CartItem = ({ item, onIncrease, onDecrease, onRemove }) => {
  if (!item) return null;

  const {
    _id,
    name,
    price_per_kg,
    bulk_price,
    price_retail,
    price,
    quantity,
    type,
    image
  } = item;

  const unitPrice =
    type === "kg"
      ? price_per_kg || price_retail || price || 0
      : bulk_price || price_retail || price || 0;

  const total = unitPrice * quantity;

  return (
    <div className="cart-item">

      <img
        src={image || "https://via.placeholder.com/80"}
        alt={name}
        className="cart-item-img"
      />

      <div className="cart-item-details">
        <h3>{name}</h3>
        <p>Type: {type}</p>
        <p>Price: ₹{unitPrice}</p>
      </div>

      <div className="cart-item-qty">
        <button onClick={() => onDecrease(_id)}>-</button>
        <span>{quantity}</span>
        <button onClick={() => onIncrease(_id)}>+</button>
      </div>

      <div className="cart-item-total">
        ₹{total}
      </div>

      <button className="remove-btn" onClick={() => onRemove(_id)}>
        Remove
      </button>

    </div>
  );
};

export default CartItem;