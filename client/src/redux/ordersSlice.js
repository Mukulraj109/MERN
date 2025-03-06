import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async function to fetch orders from backend with Authorization
export const fetchOrders = createAsyncThunk("orders/fetchOrders", async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token"); // Retrieve token from local storage

    if (!token) {
      return rejectWithValue("No authentication token found.");
    }

    const response = await axios.get("http://localhost:5000/api/orders", {
      headers: {
        Authorization: `Bearer ${token}`, // Include token in request headers
      },
    });

    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to fetch orders");
  }
});

const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    isLoading: false,
    error: null,
  },
  reducers: {}, // Add reducers if needed
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload; // Store error message in state
      });
  },
});

export default ordersSlice.reducer;
