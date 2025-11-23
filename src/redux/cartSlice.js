import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: [],
        loading: false,
        error: null,
    },

    reducers: {
        // -------- API Loading (ONLY for initial fetch)
        cartLoading: (state) => {
            state.loading = true;
            state.error = null;
        },

        cartSuccess: (state, action) => {
            state.loading = false;
            state.items = action.payload;
        },

        // -------- Add item from API
        cartAdd: (state, action) => {
            state.loading = false;
            state.items.push(action.payload);
        },

        // -------- Backend update (overwrite updated item)
        cartUpdate: (state, action) => {
            state.loading = false;
            const updated = action.payload;

            state.items = state.items.map(item =>
                (item.productId._id || item.productId) === updated.productId
                    ? updated
                    : item
            );

        },

        // -------- Remove item based on productId
        cartRemove: (state, action) => {
            state.loading = false;
            const productId = action.payload;

            state.items = state.items.filter(
                (item) => item.productId !== productId
            );
        },

        cartClear: (state) => {
            state.loading = false;
            state.items = [];
        },

        cartError: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        // -------- ⭐ OPTIMISTIC UPDATE (instant UI change)
        updateQuantityLocal: (state, action) => {
            const { productId, quantity } = action.payload;
            const match = state.items.find(
                (item) => item.productId._id === productId
            );
            if (match) {
                match.quantity = quantity;
                match.totalPrice = match.price * quantity;
            }
        },

        // -------- ⭐ OPTIMISTIC REMOVE
        removeItemLocal: (state, action) => {
            const productId = action.payload;
            state.items = state.items.filter(
                (item) => item.productId !== productId
            );
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
    updateQuantityLocal,
    removeItemLocal,
} = cartSlice.actions;

export default cartSlice.reducer;
