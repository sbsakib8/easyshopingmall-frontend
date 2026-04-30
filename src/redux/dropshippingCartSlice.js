import { createSlice } from "@reduxjs/toolkit";

// Helper to load state from localStorage
const loadCartFromStorage = () => {
    if (typeof window === "undefined") return [];
    try {
        const savedCart = localStorage.getItem("ds_cart");
        return savedCart ? JSON.parse(savedCart) : [];
    } catch (err) {
        return [];
    }
};

// Helper to save state to localStorage
const saveCartToStorage = (items) => {
    if (typeof window !== "undefined") {
        localStorage.setItem("ds_cart", JSON.stringify(items));
    }
};

const dropshippingCartSlice = createSlice({
    name: "dropshippingCart",
    initialState: {
        items: loadCartFromStorage(),
        appliedCoupon: null,
        couponDiscount: 0,
        loading: false,
        error: null,
    },

    reducers: {
        dsCartLoading: (state) => {
            state.loading = true;
            state.error = null;
        },

        dsCartSuccess: (state, action) => {
            state.loading = false;
            state.items = action.payload || [];
            saveCartToStorage(state.items);
        },

        dsCartAdd: (state, action) => {
            state.loading = false;
            const payload = action.payload;

            if (payload.products) {
                state.items = payload.products;
            } else if (payload.productId) {
                const existingIndex = state.items.findIndex(
                    (item) => (item.productId?._id || item.productId) === (payload.productId?._id || payload.productId)
                );

                if (existingIndex >= 0) {
                    state.items[existingIndex].quantity += payload.quantity || 1;
                } else {
                    state.items.push({
                        ...payload,
                        quantity: payload.quantity || 1,
                        price: payload.price || 0,
                        sellingPrice: payload.sellingPrice || payload.price || 0,
                        profit: (payload.sellingPrice || payload.price || 0) - (payload.price || 0)
                    });
                }
            }
            saveCartToStorage(state.items);
        },

        dsCartUpdate: (state, action) => {
            state.loading = false;
            state.items = action.payload.products || action.payload || [];
            saveCartToStorage(state.items);
        },

        dsCartRemove: (state, action) => {
            state.loading = false;
            const productId = action.payload;
            state.items = state.items.filter(
                (item) => (item.productId?._id || item.productId) !== productId
            );
            saveCartToStorage(state.items);
        },

        dsCartClear: (state) => {
            state.loading = false;
            state.items = [];
            state.appliedCoupon = null;
            state.couponDiscount = 0;
            saveCartToStorage([]);
        },

        dsCartError: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        updateDsQuantityLocal: (state, action) => {
            const { productId, quantity } = action.payload;
            const match = state.items.find(
                (item) => (item.productId?._id || item.productId) === productId
            );
            if (match) {
                match.quantity = Math.max(1, quantity);
                match.totalPrice = match.price * match.quantity;
                match.profit = ((match.sellingPrice || match.price) - match.price) * match.quantity;
            }
            saveCartToStorage(state.items);
        },

        updateDsSellingPriceLocal: (state, action) => {
            const { productId, sellingPrice } = action.payload;
            const match = state.items.find(
                (item) => (item.productId?._id || item.productId) === productId
            );
            if (match) {
                match.sellingPrice = sellingPrice === "" ? "" : Number(sellingPrice);
                const sp = sellingPrice === "" ? 0 : Number(sellingPrice);
                match.profit = (sp - match.price) * match.quantity;
            }
            saveCartToStorage(state.items);
        },
    },
});

export const {
    dsCartLoading,
    dsCartSuccess,
    dsCartAdd,
    dsCartUpdate,
    dsCartRemove,
    dsCartClear,
    dsCartError,
    updateDsQuantityLocal,
    updateDsSellingPriceLocal,
} = dropshippingCartSlice.actions;

export default dropshippingCartSlice.reducer;
