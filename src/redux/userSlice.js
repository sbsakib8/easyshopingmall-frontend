import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    data: null,
  },
  reducers: {
    userget: (state , action) => {
      state.data = action.payload;
    },
  },
 
});

export const { userget } = userSlice.actions;
export default userSlice.reducer;
