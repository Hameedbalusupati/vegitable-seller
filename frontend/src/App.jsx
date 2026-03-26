import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";

import { AuthProvider } from "./context/AuthProvider";
import { CartProvider } from "./context/CartContext";

// Optional global components
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>

          {/* 🔥 GLOBAL NAVBAR */}
          <Navbar />

          {/* ROUTES */}
          <AppRoutes />

        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;