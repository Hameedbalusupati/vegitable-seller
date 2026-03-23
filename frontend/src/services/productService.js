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

    if (!error.response) {
      throw new Error("Server is starting, please wait");
    }

    throw error;
  }
};

// ==============================
// GET SINGLE PRODUCT
// ==============================
export const getProductById = async (id) => {
  try {
    if (!id) throw new Error("Product ID required");

    const res = await API.get(`/products/${id}`);
    return res.data;
  } catch (error) {
    console.error("Get product error:", error);

    if (!error.response) {
      throw new Error("Server is starting, try again");
    }

    throw error;
  }
};

// ==============================
// ADD PRODUCT (ADMIN / FARMER)
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

    if (!error.response) {
      throw new Error("Server is starting, try again");
    }

    throw error;
  }
};

// ==============================
// UPDATE PRODUCT
// ==============================
export const updateProduct = async (id, data) => {
  try {
    if (!id) throw new Error("Product ID required");

    const res = await API.put(`/products/${id}`, data);
    return res.data;
  } catch (error) {
    console.error("Update product error:", error);

    if (!error.response) {
      throw new Error("Server is starting, try again");
    }

    throw error;
  }
};

// ==============================
// DELETE PRODUCT
// ==============================
export const deleteProduct = async (id) => {
  try {
    if (!id) throw new Error("Product ID required");

    const res = await API.delete(`/products/${id}`);
    return res.data;
  } catch (error) {
    console.error("Delete product error:", error);

    if (!error.response) {
      throw new Error("Server is starting, try again");
    }

    throw error;
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
      throw new Error("Server is starting, please wait");
    }

    throw error;
  }
};