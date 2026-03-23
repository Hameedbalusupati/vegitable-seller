import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Pages
import Home from "../pages/Home";
import Products from "../pages/Products";
import Cart from "../pages/Cart";
import Orders from "../pages/Order";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AdminDashboard from "../pages/AdminDashboard";
import FarmerDashboard from "../pages/FarmerDashboard";


// ==============================
// PROTECTED ROUTE
// ==============================
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};


// ==============================
// ROLE BASED ROUTE (OPTIONAL BUT BEST)
// ==============================
const RoleRoute = ({ children, role }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (user.role !== role) return <Navigate to="/" replace />;

  return children;
};


// ==============================
// ROUTES
// ==============================
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

      {/* ADMIN DASHBOARD */}
      <Route
        path="/admin"
        element={
          <RoleRoute role="admin">
            <AdminDashboard />
          </RoleRoute>
        }
      />

      {/* FARMER DASHBOARD */}
      <Route
        path="/farmer"
        element={
          <RoleRoute role="farmer">
            <FarmerDashboard />
          </RoleRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  );
}