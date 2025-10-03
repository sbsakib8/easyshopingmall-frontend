import { createSlice } from "@reduxjs/toolkit";

const categorySlice = createSlice({
  name: "category",
  initialState: {
    allCategorydata: null,
  },
  reducers: {
    categoryGet: (state , action) => {
      state.allCategorydata = action.payload;
    },
    
  },
 
});

export const { categoryGet } = categorySlice.actions;
export default categorySlice.reducer;
