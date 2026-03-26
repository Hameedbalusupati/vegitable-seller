import API from "./api";

// ==============================
// GET ALL PRODUCTS
// ==============================
export const getProducts = async () => {
  try {
    const res = await API.get("/products");
    return res.data || [];
  } catch (error) {
    console.error("Get products error:", error);

    // 🔥 IMPORTANT: Don't break UI
    if (!error.response) {
      console.warn("Backend is sleeping or not reachable");
      return []; // return empty instead of throwing
    }

    return [];
  }
};

// ==============================
// GET SINGLE PRODUCT
// ==============================
export const getProductById = async (id) => {
  try {
    if (!id) return null;

    const res = await API.get(`/products/${id}`);
    return res.data;
  } catch (error) {
    console.error("Get product error:", error);

    if (!error.response) {
      console.warn("Backend sleeping...");
      return null;
    }

    return null;
  }
};

// ==============================
// ADD PRODUCT
// ==============================
export const addProduct = async (data) => {
  try {
    if (!data || !data.name) {
      throw new Error("Invalid product data");
    }

    const res = await API.post("/products", data);
    return res.data;
  } catch (error) {
    console.error("Add product error:", error);
    return null;
  }
};

// ==============================
// UPDATE PRODUCT
// ==============================
export const updateProduct = async (id, data) => {
  try {
    if (!id) return null;

    const res = await API.put(`/products/${id}`, data);
    return res.data;
  } catch (error) {
    console.error("Update product error:", error);
    return null;
  }
};

// ==============================
// DELETE PRODUCT
// ==============================
export const deleteProduct = async (id) => {
  try {
    if (!id) return null;

    const res = await API.delete(`/products/${id}`);
    return res.data;
  } catch (error) {
    console.error("Delete product error:", error);
    return null;
  }
};

// ==============================
// SEARCH PRODUCTS
// ==============================
export const searchProducts = async (query) => {
  try {
    if (!query) return [];

    const res = await API.get(`/products?search=${encodeURIComponent(query)}`);
    return res.data || [];
  } catch (error) {
    console.error("Search error:", error);

    if (!error.response) {
      console.warn("Backend sleeping...");
      return [];
    }

    return [];
  }
};