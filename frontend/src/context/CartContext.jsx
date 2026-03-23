/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useState } from "react";

// Create Context
const CartContext = createContext();

// Custom Hook
export const useCart = () => {
  return useContext(CartContext);
};

// Provider
export const CartProvider = ({ children }) => {

  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cart")) || [];
    } catch {
      return [];
    }
  });

  // ==============================
  // SAVE CART
  // ==============================
  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  // ==============================
  // ADD TO CART
  // ==============================
  const addToCart = (product) => {
    let updated = [...cart];

    const existing = updated.find(
      (item) => item.id === product.id || item._id === product._id
    );

    if (existing) {
      existing.quantity += 1;
    } else {
      updated.push({ ...product, quantity: 1 });
    }

    saveCart(updated);
  };

  // ==============================
  // REMOVE
  // ==============================
  const removeFromCart = (id) => {
    const updated = cart.filter(
      (item) => item.id !== id && item._id !== id
    );
    saveCart(updated);
  };

  // ==============================
  // INCREASE
  // ==============================
  const increaseQty = (id) => {
    const updated = cart.map((item) =>
      item.id === id || item._id === id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    saveCart(updated);
  };

  // ==============================
  // DECREASE
  // ==============================
  const decreaseQty = (id) => {
    const updated = cart
      .map((item) =>
        item.id === id || item._id === id
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0);

    saveCart(updated);
  };

  // ==============================
  // CLEAR
  // ==============================
  const clearCart = () => {
    saveCart([]);
  };

  // ==============================
  // TOTAL PRICE
  // ==============================
  const totalPrice = cart.reduce(
    (sum, item) =>
      sum +
      (item.price_retail || item.price_per_kg || item.price || 0) *
        item.quantity,
    0
  );

  // ==============================
  // TOTAL ITEMS
  // ==============================
  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        clearCart,
        totalPrice,
        totalItems
      }}
    >
      {children}
    </CartContext.Provider>
  );
};