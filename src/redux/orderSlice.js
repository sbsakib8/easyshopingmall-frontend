// src/redux/slices/orderSlice.js
import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
    name: "order",
    initialState: {
        orders: [],
        loading: false,
        error: null,
        successMessage: "",
    },
    reducers: {
        setOrders: (state, action) => {
            state.orders = action.payload;
        },
        addOrder: (state, action) => {
            state.orders.unshift(action.payload);
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        setSuccessMessage: (state, action) => {
            state.successMessage = action.payload;
        },
    },
});

export const {
    setOrders,
    addOrder,
    setLoading,
    setError,
    setSuccessMessage,
} = orderSlice.actions;

export default orderSlice.reducer;
