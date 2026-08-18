import { createSlice } from "@reduxjs/toolkit";

const floatingCartSlice = createSlice({
  name: "floatingCart",
  initialState: {
    isOpen: false,
  },
  reducers: {
    toggleFloatingCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    openFloatingCart: (state) => {
      state.isOpen = true;
    },
    closeFloatingCart: (state) => {
      state.isOpen = false;
    },
  },
});

export const { toggleFloatingCart, openFloatingCart, closeFloatingCart } = floatingCartSlice.actions;
export default floatingCartSlice.reducer;
