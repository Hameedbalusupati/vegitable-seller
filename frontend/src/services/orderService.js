import API from "./api";

// ==============================
// CREATE ORDER (CHECKOUT)
// ==============================
export const createOrder = async (orderData) => {
  try {
    const res = await API.post("/orders", orderData);

    if (!res.data) {
      throw new Error("Invalid response from server");
    }

    return res.data;
  } catch (error) {
    console.error("Create order error:", error);

    if (!error.response) {
      throw new Error("Server is starting, please try again");
    }

    throw error;
  }
};

// ==============================
// GET MY ORDERS (USER)
// ==============================
export const getMyOrders = async () => {
  try {
    const res = await API.get("/orders/my");

    return res.data || [];
  } catch (error) {
    console.error("Get my orders error:", error);

    if (!error.response) {
      throw new Error("Server is starting, please wait");
    }

    throw error;
  }
};

// ==============================
// GET ALL ORDERS (ADMIN)
// ==============================
export const getAllOrders = async () => {
  try {
    const res = await API.get("/orders");

    return res.data || [];
  } catch (error) {
    console.error("Get all orders error:", error);

    if (!error.response) {
      throw new Error("Server is starting, please wait");
    }

    throw error;
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
    console.error("Update order error:", error);

    if (!error.response) {
      throw new Error("Server is starting, try again");
    }

    throw error;
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
    console.error("Delete order error:", error);

    if (!error.response) {
      throw new Error("Server is starting, try again");
    }

    throw error;
  }
};