import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import ordersReducer from "./ordersSlice";
import materialsReducer from "./materialsSlice"; // Ensure this exists

const store = configureStore({
  reducer: {
    auth: authReducer,
    orders: ordersReducer,
    materials: materialsReducer,
  },
});

export default store; // ✅ Ensure this line exists
