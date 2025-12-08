import { createSlice } from "@reduxjs/toolkit";

const subcategorySlice = createSlice({
  name: "subcategory",
  initialState: {
    allsubCategorydata: null,
  },
  reducers: {
    subcategoryGet: (state , action) => {
      state.allsubCategorydata = action.payload;
    },
    
  },
 
});

export const { subcategoryGet } = subcategorySlice.actions;
export default subcategorySlice.reducer;
