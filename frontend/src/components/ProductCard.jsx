import React, { useState } from "react";
import "./ProductCard.css";

const ProductCard = ({ product, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [type, setType] = useState("kg");

  const {
    id,
    name,
    price_per_kg,
    bulk_price,
    stock,
    image
  } = product;

  const handleAdd = () => {
    if (quantity <= 0) return;

    onAddToCart({
      ...product,
      quantity,
      type
    });
  };

  return (
    <div className="product-card">

      {/* Image */}
      <img
        src={image || "https://via.placeholder.com/150"}
        alt={name}
        className="product-img"
      />

      {/* Details */}
      <div className="product-info">
        <h3>{name}</h3>

        <p className="price">
          ₹{price_per_kg}/kg | ₹{bulk_price} bulk
        </p>

        <p className="stock">
          {stock > 0 ? `Stock: ${stock}` : "Out of Stock"}
        </p>

        {/* Type Selection */}
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="kg">Per KG</option>
          <option value="bulk">Bulk</option>
        </select>

        {/* Quantity */}
        <div className="qty-box">
          <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
          <span>{quantity}</span>
          <button onClick={() => setQuantity(quantity + 1)}>+</button>
        </div>

        {/* Add to Cart */}
        <button
          className="add-btn"
          onClick={handleAdd}
          disabled={stock === 0}
        >
          Add to Cart 🛒
        </button>
      </div>
    </div>
  );
};

export default ProductCard;