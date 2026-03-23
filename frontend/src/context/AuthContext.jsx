import { createContext, useContext } from "react";

// Create Context
export const AuthContext = createContext();

// Custom Hook
export const useAuth = () => {
  return useContext(AuthContext);
};