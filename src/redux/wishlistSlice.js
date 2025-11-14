// redux/wishlistSlice.js
import { createSlice } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState: {
        data: [],
        loading: false,
        error: null,
    },
    reducers: {
        wishlistLoading: (state) => {
            state.loading = true;
            state.error = null;
        },
        wishlistError: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        wishlistSet: (state, action) => {
            state.loading = false;
            state.data = action.payload;
        },
        wishlistAdd: (state, action) => {
            state.loading = false;
            state.data.push(action.payload);
        },
        wishlistRemove: (state, action) => {
            state.data = state.data.filter((item) => item.id !== action.payload);
        },
        wishlistClear: (state) => {
            state.data = [];
        },
    },
});

export const {
    wishlistLoading,
    wishlistError,
    wishlistSet,
    wishlistAdd,
    wishlistRemove,
    wishlistClear,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
