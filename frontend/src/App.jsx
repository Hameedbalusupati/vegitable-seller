import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";

// ✅ FIX: default import (NO curly braces)
import AuthProvider from "./context/AuthContext";

// ✅ CartProvider is correct (named export)
import { CartProvider } from "./context/CartContext";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;