// src/redux/cartSlice.js
import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: [],       // all cart items
        loading: false,
        error: null,
    },
    reducers: {
        cartLoading: (state) => {
            state.loading = true;
            state.error = null;
        },
        cartSuccess: (state, action) => {
            state.loading = false;
            state.items = action.payload;
        },
        cartAdd: (state, action) => {
            state.loading = false;
            state.items.push(action.payload);
        },
        cartUpdate: (state, action) => {
            state.loading = false;
            const updatedItem = action.payload;
            state.items = state.items.map((item) =>
                item.productId === updatedItem.productId ? updatedItem : item
            );
        },
        cartRemove: (state, action) => {
            state.loading = false;
            state.items = state.items.filter((item) => item.productId !== action.payload);
        },
        cartClear: (state) => {
            state.loading = false;
            state.items = [];
        },
        cartError: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const {
    cartLoading,
    cartSuccess,
    cartAdd,
    cartUpdate,
    cartRemove,
    cartClear,
    cartError,
} = cartSlice.actions;

export default cartSlice.reducer;
