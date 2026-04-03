import { createSlice } from "@reduxjs/toolkit";

// Helper to get initial state from localStorage safely
const getStoredCoupon = () => {
    if (typeof window === "undefined") return null;
    try {
        const stored = localStorage.getItem("appliedCoupon");
        return stored ? JSON.parse(stored) : null;
    } catch (e) {
        return null;
    }
};

const getStoredDiscount = () => {
    if (typeof window === "undefined") return 0;
    try {
        const stored = localStorage.getItem("couponDiscount");
        return stored ? Number(stored) : 0;
    } catch (e) {
        return 0;
    }
};

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: [],
        appliedCoupon: getStoredCoupon(),
        couponDiscount: getStoredDiscount(),
        loading: false,
        error: null,
    },

    reducers: {
        setCoupon: (state, action) => {
            state.appliedCoupon = action.payload.coupon;
            state.couponDiscount = action.payload.discountAmount;
            if (typeof window !== "undefined") {
                localStorage.setItem("appliedCoupon", JSON.stringify(action.payload.coupon));
                localStorage.setItem("couponDiscount", action.payload.discountAmount.toString());
            }
        },
        clearCoupon: (state) => {
            state.appliedCoupon = null;
            state.couponDiscount = 0;
            if (typeof window !== "undefined") {
                localStorage.removeItem("appliedCoupon");
                localStorage.removeItem("couponDiscount");
            }
        },
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
            state.appliedCoupon = null;
            state.couponDiscount = 0;
            if (typeof window !== "undefined") {
                localStorage.removeItem("appliedCoupon");
                localStorage.removeItem("couponDiscount");
            }
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
    setCoupon,
    clearCoupon,
} = cartSlice.actions;

export default cartSlice.reducer;
