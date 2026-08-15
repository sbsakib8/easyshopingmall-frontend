import { createSlice } from "@reduxjs/toolkit";

const floatingCartSlice = createSlice({
  name: "floatingCart",
  initialState: {
    item: null,
    show: false,
  },
  reducers: {
    showFloatingCart: (state, action) => {
      state.item = action.payload;
      state.show = true;
    },
    hideFloatingCart: (state) => {
      state.show = false;
      state.item = null;
    },
  },
});

export const { showFloatingCart, hideFloatingCart } = floatingCartSlice.actions;
export default floatingCartSlice.reducer;
