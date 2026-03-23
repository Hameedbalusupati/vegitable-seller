import API from "./api";

// ==============================
// GET ALL PRODUCTS
// ==============================
export const getProducts = async () => {
  try {
    const res = await API.get("/products");
    return res.data;
  } catch (error) {
    console.error("Get products error:", error);
    throw error;
  }
};

// ==============================
// GET SINGLE PRODUCT
// ==============================
export const getProductById = async (id) => {
  try {
    const res = await API.get(`/products/${id}`);
    return res.data;
  } catch (error) {
    console.error("Get product error:", error);
    throw error;
  }
};

// ==============================
// ADD PRODUCT (ADMIN / FARMER)
// ==============================
export const addProduct = async (data) => {
  try {
    const res = await API.post("/products", data);
    return res.data;
  } catch (error) {
    console.error("Add product error:", error);
    throw error;
  }
};

// ==============================
// UPDATE PRODUCT
// ==============================
export const updateProduct = async (id, data) => {
  try {
    const res = await API.put(`/products/${id}`, data);
    return res.data;
  } catch (error) {
    console.error("Update product error:", error);
    throw error;
  }
};

// ==============================
// DELETE PRODUCT
// ==============================
export const deleteProduct = async (id) => {
  try {
    const res = await API.delete(`/products/${id}`);
    return res.data;
  } catch (error) {
    console.error("Delete product error:", error);
    throw error;
  }
};

// ==============================
// SEARCH PRODUCTS (OPTIONAL)
// ==============================
export const searchProducts = async (query) => {
  try {
    const res = await API.get(`/products?search=${query}`);
    return res.data;
  } catch (error) {
    console.error("Search error:", error);
    throw error;
  }
};