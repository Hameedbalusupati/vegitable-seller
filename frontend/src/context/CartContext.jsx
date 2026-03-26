/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useState, useEffect } from "react";

// Create Context
const CartContext = createContext();

// Custom Hook
export const useCart = () => {
  return useContext(CartContext);
};

// Provider
export const CartProvider = ({ children }) => {

  const [cart, setCart] = useState([]);

  // ==============================
  // LOAD CART
  // ==============================
  useEffect(() => {
    try {
      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCart(storedCart);
    } catch {
      setCart([]);
    }

    // Sync across components 🔥
    window.addEventListener("storage", loadCart);

    return () => {
      window.removeEventListener("storage", loadCart);
    };
  }, []);

  const loadCart = () => {
    try {
      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCart(storedCart);
    } catch {
      setCart([]);
    }
  };

  // ==============================
  // SAVE CART
  // ==============================
  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));

    // 🔥 notify all components
    window.dispatchEvent(new Event("storage"));
  };

  // ==============================
  // ADD TO CART
  // ==============================
  const addToCart = (product) => {
    if (!product) return;

    let updated = [...cart];

    const existing = updated.find(
      (item) => item._id === product._id
    );

    if (existing) {
      // respect stock if available
      const newQty = existing.quantity + (product.quantity || 1);
      existing.quantity = product.stock
        ? Math.min(newQty, product.stock)
        : newQty;
    } else {
      updated.push({
        ...product,
        quantity: product.quantity || 1
      });
    }

    saveCart(updated);
  };

  // ==============================
  // REMOVE
  // ==============================
  const removeFromCart = (id) => {
    const updated = cart.filter((item) => item._id !== id);
    saveCart(updated);
  };

  // ==============================
  // INCREASE
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

    saveCart(updated);
  };

  // ==============================
  // DECREASE
  // ==============================
  const decreaseQty = (id) => {
    const updated = cart
      .map((item) =>
        item._id === id
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
      (item.selectedPrice ||
        item.price_per_kg ||
        item.price_retail ||
        item.price ||
        0) *
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
        setCart,
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