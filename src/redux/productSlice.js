import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "product",
  initialState: {
    productdata: null,
  },
  reducers: {
    productGet: (state , action) => {
      state.productdata = action.payload;
    },
    
  },
 
});

export const { productGet } = productSlice.actions;
export default productSlice.reducer;
