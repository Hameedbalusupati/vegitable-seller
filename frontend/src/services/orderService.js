import API from "./api";

// ==============================
// CREATE ORDER (CHECKOUT)
// ==============================
export const createOrder = async (orderData) => {
  try {
    const res = await API.post("/orders", orderData);
    return res.data;
  } catch (error) {
    console.error("Create order error:", error);
    throw error;
  }
};

// ==============================
// GET MY ORDERS (USER)
// ==============================
export const getMyOrders = async () => {
  try {
    const res = await API.get("/orders/my");
    return res.data;
  } catch (error) {
    console.error("Get my orders error:", error);
    throw error;
  }
};

// ==============================
// GET ALL ORDERS (ADMIN)
// ==============================
export const getAllOrders = async () => {
  try {
    const res = await API.get("/orders");
    return res.data;
  } catch (error) {
    console.error("Get all orders error:", error);
    throw error;
  }
};

// ==============================
// UPDATE ORDER STATUS
// ==============================
export const updateOrderStatus = async (id, status) => {
  try {
    const res = await API.put(`/orders/${id}`, { status });
    return res.data;
  } catch (error) {
    console.error("Update order error:", error);
    throw error;
  }
};

// ==============================
// DELETE ORDER (OPTIONAL)
// ==============================
export const deleteOrder = async (id) => {
  try {
    const res = await API.delete(`/orders/${id}`);
    return res.data;
  } catch (error) {
    console.error("Delete order error:", error);
    throw error;
  }
};