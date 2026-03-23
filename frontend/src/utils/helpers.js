// ==============================
// FORMAT PRICE (₹)
// ==============================
export const formatPrice = (price) => {
  if (!price) return "₹0";
  return "₹" + Number(price).toLocaleString("en-IN");
};

// ==============================
// FORMAT DATE
// ==============================
export const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
};

// ==============================
// CAPITALIZE TEXT
// ==============================
export const capitalize = (text) => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
};

// ==============================
// GENERATE RANDOM ORDER ID
// ==============================
export const generateOrderId = () => {
  return "ORD-" + Math.floor(Math.random() * 1000000);
};

// ==============================
// DEBOUNCE FUNCTION (SEARCH)
// ==============================
export const debounce = (func, delay = 500) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

// ==============================
// SAVE TO LOCAL STORAGE
// ==============================
export const saveToStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

// ==============================
// GET FROM LOCAL STORAGE
// ==============================
export const getFromStorage = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
};

// ==============================
// REMOVE FROM LOCAL STORAGE
// ==============================
export const removeFromStorage = (key) => {
  localStorage.removeItem(key);
};

// ==============================
// STATUS COLOR CLASS
// ==============================
export const getStatusColor = (status) => {
  switch (status) {
    case "Pending":
      return "orange";
    case "Shipped":
      return "blue";
    case "Delivered":
      return "green";
    case "Cancelled":
      return "red";
    default:
      return "gray";
  }
};