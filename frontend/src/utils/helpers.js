// ==============================
// FORMAT PRICE (₹)
// ==============================
export const formatPrice = (price) => {
  if (price === null || price === undefined) return "₹0";
  return "₹" + Number(price).toLocaleString("en-IN");
};

// ==============================
// FORMAT DATE
// ==============================
export const formatDate = (date) => {
  if (!date) return "";
  try {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  } catch {
    return "";
  }
};

// ==============================
// CAPITALIZE TEXT
// ==============================
export const capitalize = (text) => {
  if (!text) return "";
  return text
    .toString()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// ==============================
// GENERATE UNIQUE ORDER ID
// ==============================
export const generateOrderId = () => {
  return (
    "ORD-" +
    Date.now().toString().slice(-6) +
    "-" +
    Math.floor(Math.random() * 1000)
  );
};

// ==============================
// DEBOUNCE FUNCTION (SAFE)
// ==============================
export const debounce = (func, delay = 500) => {
  let timer;
  return (...args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

// ==============================
// SAVE TO LOCAL STORAGE (SAFE)
// ==============================
export const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error("Storage save error:", err);
  }
};

// ==============================
// GET FROM LOCAL STORAGE
// ==============================
export const getFromStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error("Storage read error:", err);
    return null;
  }
};

// ==============================
// REMOVE FROM LOCAL STORAGE
// ==============================
export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.error("Storage remove error:", err);
  }
};

// ==============================
// STATUS COLOR CLASS
// ==============================
export const getStatusColor = (status) => {
  switch (status) {
    case "Pending":
      return "orange";
    case "Packed":
      return "purple";
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