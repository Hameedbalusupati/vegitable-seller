import API from "./api";

// ==============================
// HELPER: HANDLE ERROR
// ==============================
const handleError = (error, defaultMsg) => {
  console.error(defaultMsg, error);

  if (!error.response) {
    throw new Error("Server is starting, please try again ⏳");
  }

  throw new Error(
    error.response?.data?.message || defaultMsg || "Something went wrong ❌"
  );
};

// ==============================
// CREATE ORDER (CHECKOUT)
// ==============================
export const createOrder = async (orderData) => {
  try {
    if (!orderData || !orderData.items?.length) {
      throw new Error("Invalid order data");
    }

    const res = await API.post("/orders", orderData);

    if (!res.data) {
      throw new Error("Invalid response from server");
    }

    return res.data;
  } catch (error) {
    handleError(error, "Create order failed");
  }
};

// ==============================
// GET MY ORDERS (USER)
// ==============================
export const getMyOrders = async () => {
  try {
    const res = await API.get("/orders/my");

    return Array.isArray(res.data) ? res.data : [];
  } catch (error) {
    handleError(error, "Fetch orders failed");
  }
};

// ==============================
// GET ALL ORDERS (ADMIN)
// ==============================
export const getAllOrders = async () => {
  try {
    const res = await API.get("/orders");

    return Array.isArray(res.data) ? res.data : [];
  } catch (error) {
    handleError(error, "Fetch all orders failed");
  }
};

// ==============================
// UPDATE ORDER STATUS
// ==============================
export const updateOrderStatus = async (id, status) => {
  try {
    if (!id || !status) {
      throw new Error("Invalid input");
    }

    const res = await API.put(`/orders/${id}`, { status });

    return res.data;
  } catch (error) {
    handleError(error, "Update order failed");
  }
};

// ==============================
// DELETE ORDER (OPTIONAL)
// ==============================
export const deleteOrder = async (id) => {
  try {
    if (!id) {
      throw new Error("Order ID is required");
    }

    const res = await API.delete(`/orders/${id}`);

    return res.data;
  } catch (error) {
    handleError(error, "Delete order failed");
  }
};