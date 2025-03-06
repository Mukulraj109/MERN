import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  materials: [],
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const materialsSlice = createSlice({
  name: "materials",
  initialState,
  reducers: {
    setMaterials(state, action) {
      state.materials = action.payload;
    },
  },
});

export const { setMaterials } = materialsSlice.actions;
export default materialsSlice.reducer;
