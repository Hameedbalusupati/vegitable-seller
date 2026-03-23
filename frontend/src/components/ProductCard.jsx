import React, { useState } from "react";
import "./ProductCard.css";

const ProductCard = ({ product, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [type, setType] = useState("kg");

  if (!product) return null;

  const {
    _id,
    name,
    price_per_kg,
    bulk_price,
    price_retail,
    price,
    stock,
    image
  } = product;

  const finalPrice =
    type === "bulk"
      ? bulk_price || price_retail || price
      : price_per_kg || price_retail || price;

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

      <img
        src={image || "https://via.placeholder.com/150"}
        alt={name}
        className="product-img"
      />

      <div className="product-info">
        <h3>{name}</h3>

        <p className="price">
          ₹{price_per_kg || price_retail || price}/kg | ₹{bulk_price || price} bulk
        </p>

        <p className="stock">
          {stock > 0 ? `Stock: ${stock}` : "Out of Stock"}
        </p>

        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="kg">Per KG</option>
          <option value="bulk">Bulk</option>
        </select>

        <div className="qty-box">
          <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
          <span>{quantity}</span>
          <button onClick={() => setQuantity(quantity + 1)}>+</button>
        </div>

        <button
          className="add-btn"
          onClick={handleAdd}
          disabled={stock === 0}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;