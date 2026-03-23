import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Pages
import Home from "../pages/Home";
import Products from "../pages/Products";
import Cart from "../pages/Cart";
import Orders from "../pages/Order"; // or "../pages/Order"
import Login from "../pages/Login";
import Register from "../pages/Register";
import AdminDashboard from "../pages/AdminDashboard";
import FarmerDashboard from "../pages/FarmerDashboard";

// Protected Route
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <h2>Loading...</h2>;

  return user ? children : <Navigate to="/login" />;
};

export default function AppRoutes() {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* PROTECTED */}
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        }
      />

      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        }
      />

      {/* DASHBOARDS */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/farmer" element={<FarmerDashboard />} />

      {/* 404 */}
      <Route path="*" element={<h2>Page Not Found</h2>} />
    </Routes>
  );
}