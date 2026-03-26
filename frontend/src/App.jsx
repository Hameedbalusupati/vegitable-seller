import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";

import { AuthProvider } from "./context/AuthContext"; // ✅ FIXED
import { CartProvider } from "./context/CartContext";

// Components
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>

          {/* GLOBAL NAVBAR */}
          <Navbar />

          {/* ROUTES */}
          <AppRoutes />

        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;