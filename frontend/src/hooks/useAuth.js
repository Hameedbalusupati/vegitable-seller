import { useContext } from "react";
import { AuthContext } from "./AuthContext"; // adjust path if needed

export default function useAuth() {
  const context = useContext(AuthContext);

  // ❗ Safety check
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}