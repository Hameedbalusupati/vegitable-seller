import React, { useState } from "react";
import "./ProductCard.css";

const ProductCard = ({ product, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [type, setType] = useState("kg");

  if (!product) return null;

  const {
    _id = "",
    name = "Product",
    price_per_kg = 0,
    bulk_price = 0,
    price_retail = 0,
    price = 0,
    stock = 0,
    image = ""
  } = product;

  // ==============================
  // PRICE CALCULATION
  // ==============================
  const finalPrice =
    type === "bulk"
      ? bulk_price || price_retail || price || 0
      : price_per_kg || price_retail || price || 0;

  // ==============================
  // HANDLERS
  // ==============================
  const increaseQty = () => {
    if (quantity < stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQty = () => {
    setQuantity(Math.max(1, quantity - 1));
  };

  const handleAdd = () => {
    if (quantity <= 0 || stock === 0) return;

    onAddToCart({
      ...product,
      _id,
      quantity,
      type,
      selectedPrice: finalPrice
    });
  };

  return (
    <div className="product-card">

      {/* IMAGE */}
      <img
        src={image || "https://via.placeholder.com/150"}
        alt={name}
        className="product-img"
      />

      {/* INFO */}
      <div className="product-info">
        <h3>{name}</h3>

        <p className="price">
          ₹{(price_per_kg || price_retail || price || 0).toFixed(2)}/kg |
          ₹{(bulk_price || price || 0).toFixed(2)} bulk
        </p>

        <p className={`stock ${stock === 0 ? "out" : ""}`}>
          {stock > 0 ? `Stock: ${stock}` : "Out of Stock"}
        </p>

        {/* TYPE SELECT */}
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          disabled={stock === 0}
        >
          <option value="kg">Per KG</option>
          <option value="bulk">Bulk</option>
        </select>

        {/* QUANTITY */}
        <div className="qty-box">
          <button onClick={decreaseQty} disabled={stock === 0}>-</button>
          <span>{quantity}</span>
          <button onClick={increaseQty} disabled={quantity >= stock}>+</button>
        </div>

        {/* ADD BUTTON */}
        <button
          className="add-btn"
          onClick={handleAdd}
          disabled={stock === 0}
        >
          {stock === 0 ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;