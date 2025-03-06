import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../api/axios";

// Async function for user registration
export const registerUser = createAsyncThunk("auth/registerUser", async (userData, thunkAPI) => {
  try {
    const response = await axios.post("/api/auth/register", userData);
    return response.data; // API returns { token }
  } catch (error) {
    console.error("Registration Error:", error.response?.data);
    return thunkAPI.rejectWithValue(error.response?.data || { msg: "Registration failed. Try again." });
  }
});

// Async function for user login
export const loginUser = createAsyncThunk("auth/login", async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post("/auth/login", userData);
    console.log("Login API Response:", response.data);

    return response.data; // API returns { token }
  } catch (error) {
    console.error("Login API Error:", error.response?.data);
    return rejectWithValue(error.response?.data?.msg || "Login failed");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: localStorage.getItem("token") || null,
    role: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.role = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle user registration
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Handle user login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
