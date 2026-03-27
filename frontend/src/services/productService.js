import API from "./api";

// ==============================
// HELPER: HANDLE ERROR
// ==============================
const handleError = (error, defaultMsg, fallback = null) => {
  console.error(defaultMsg, error);

  if (!error.response) {
    console.warn("Server not reachable / sleeping...");
    return fallback;
  }

  return fallback;
};

// ==============================
// HELPER: NORMALIZE DATA
// ==============================
const normalizeProducts = (data) => {
  if (!data) return [];

  if (Array.isArray(data)) return data;

  if (Array.isArray(data.products)) return data.products;

  if (Array.isArray(data.data)) return data.data;

  return [];
};

// ==============================
// GET ALL PRODUCTS (FIXED)
// ==============================
export const getProducts = async () => {
  try {
    const res = await API.get("/products");

    console.log("RAW PRODUCTS RESPONSE:", res.data);

    return normalizeProducts(res.data);
  } catch (error) {
    return handleError(error, "Get products error", []);
  }
};

// ==============================
// GET SINGLE PRODUCT
// ==============================
export const getProductById = async (id) => {
  try {
    if (!id) return null;

    const res = await API.get(`/products/${id}`);

    return res.data?.product || res.data || null;
  } catch (error) {
    return handleError(error, "Get product error", null);
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

    return res.data?.product || res.data || null;
  } catch (error) {
    console.error("Add product error:", error);
    throw new Error(
      error.response?.data?.message || "Failed to add product ❌"
    );
  }
};

// ==============================
// UPDATE PRODUCT
// ==============================
export const updateProduct = async (id, data) => {
  try {
    if (!id || !data) {
      throw new Error("Invalid update data");
    }

    const res = await API.put(`/products/${id}`, data);

    return res.data?.product || res.data || null;
  } catch (error) {
    console.error("Update product error:", error);
    throw new Error(
      error.response?.data?.message || "Failed to update product ❌"
    );
  }
};

// ==============================
// DELETE PRODUCT
// ==============================
export const deleteProduct = async (id) => {
  try {
    if (!id) {
      throw new Error("Product ID is required");
    }

    const res = await API.delete(`/products/${id}`);

    return res.data || null;
  } catch (error) {
    console.error("Delete product error:", error);
    throw new Error(
      error.response?.data?.message || "Failed to delete product ❌"
    );
  }
};

// ==============================
// SEARCH PRODUCTS (FIXED)
// ==============================
export const searchProducts = async (query) => {
  try {
    if (!query) return [];

    const res = await API.get(
      `/products?search=${encodeURIComponent(query)}`
    );

    return normalizeProducts(res.data);
  } catch (error) {
    return handleError(error, "Search error", []);
  }
};