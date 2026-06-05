import { createSlice } from "@reduxjs/toolkit";

const cartKey = (userId) => (userId ? `ds_cart_${userId}` : null);
const couponKey = (userId) => (userId ? `ds_appliedCoupon_${userId}` : null);
const discountKey = (userId) => (userId ? `ds_couponDiscount_${userId}` : null);

const safeParse = (raw, fallback) => {
    if (typeof window === "undefined" || !raw) return fallback;
    try {
        return JSON.parse(raw);
    } catch {
        return fallback;
    }
};

const loadCartForUser = (userId) => {
    const key = cartKey(userId);
    if (!key) return [];
    return safeParse(localStorage.getItem(key), []);
};

const loadCouponForUser = (userId) => {
    const key = couponKey(userId);
    if (!key) return null;
    return safeParse(localStorage.getItem(key), null);
};

const loadDiscountForUser = (userId) => {
    const key = discountKey(userId);
    if (!key) return 0;
    const v = localStorage.getItem(key);
    return v ? Number(v) : 0;
};

const persistCart = (userId, items) => {
    const key = cartKey(userId);
    if (!key || typeof window === "undefined") return;
    localStorage.setItem(key, JSON.stringify(items));
};

const persistCoupon = (userId, coupon) => {
    const key = couponKey(userId);
    if (!key || typeof window === "undefined") return;
    if (coupon) {
        localStorage.setItem(key, JSON.stringify(coupon));
    } else {
        localStorage.removeItem(key);
    }
};

const persistDiscount = (userId, discount) => {
    const key = discountKey(userId);
    if (!key || typeof window === "undefined") return;
    if (discount) {
        localStorage.setItem(key, discount.toString());
    } else {
        localStorage.removeItem(key);
    }
};

// Clean up legacy unscoped keys (ds_cart / ds_appliedCoupon / ds_couponDiscount)
// that the previous version of this slice used. Scoped keys are now the
// source of truth, so the old keys are safe to drop on the client.
const cleanupLegacyKeys = () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("ds_cart");
    localStorage.removeItem("ds_appliedCoupon");
    localStorage.removeItem("ds_couponDiscount");
};

const dropshippingCartSlice = createSlice({
    name: "dropshippingCart",
    initialState: {
        items: [],
        appliedCoupon: null,
        couponDiscount: 0,
        currentUserId: null,
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
            persistCart(state.currentUserId, state.items);
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
            persistCart(state.currentUserId, state.items);
        },

        dsCartUpdate: (state, action) => {
            state.loading = false;
            state.items = action.payload.products || action.payload || [];
            persistCart(state.currentUserId, state.items);
        },

        dsCartRemove: (state, action) => {
            state.loading = false;
            const productId = action.payload;
            state.items = state.items.filter(
                (item) => (item.productId?._id || item.productId) !== productId
            );
            persistCart(state.currentUserId, state.items);
        },

        dsCartClear: (state) => {
            state.loading = false;
            state.items = [];
            state.appliedCoupon = null;
            state.couponDiscount = 0;
            persistCart(state.currentUserId, []);
            persistCoupon(state.currentUserId, null);
            persistDiscount(state.currentUserId, 0);
        },

        dsCartError: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        setDsCoupon: (state, action) => {
            state.appliedCoupon = action.payload.coupon;
            state.couponDiscount = action.payload.discountAmount;
            persistCoupon(state.currentUserId, state.appliedCoupon);
            persistDiscount(state.currentUserId, state.couponDiscount);
        },

        clearDsCoupon: (state) => {
            state.appliedCoupon = null;
            state.couponDiscount = 0;
            persistCoupon(state.currentUserId, null);
            persistDiscount(state.currentUserId, 0);
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
            persistCart(state.currentUserId, state.items);
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
            persistCart(state.currentUserId, state.items);
        },

        // Switches the in-memory cart to the supplied user's persisted cart.
        // Pass `null` to clear the cart (e.g. when the user logs out).
        dsCartLoadForUser: (state, action) => {
            const newUserId = action.payload || null;
            if (newUserId === state.currentUserId) return;

            state.currentUserId = newUserId;
            if (newUserId) {
                state.items = loadCartForUser(newUserId);
                state.appliedCoupon = loadCouponForUser(newUserId);
                state.couponDiscount = loadDiscountForUser(newUserId);
            } else {
                state.items = [];
                state.appliedCoupon = null;
                state.couponDiscount = 0;
            }
        },
    },

    // Keep the dropshipping cart in sync with the currently authenticated
    // user so that switching accounts in the same browser never leaks the
    // previous user's items into the new session.
    extraReducers: (builder) => {
        cleanupLegacyKeys();

        builder
            .addCase("user/userget", (state, action) => {
                const newUserId = action.payload?._id || null;
                if (newUserId === state.currentUserId) return;

                state.currentUserId = newUserId;
                if (newUserId) {
                    state.items = loadCartForUser(newUserId);
                    state.appliedCoupon = loadCouponForUser(newUserId);
                    state.couponDiscount = loadDiscountForUser(newUserId);
                } else {
                    state.items = [];
                    state.appliedCoupon = null;
                    state.couponDiscount = 0;
                }
            })
            .addCase("user/clearUser", (state) => {
                state.currentUserId = null;
                state.items = [];
                state.appliedCoupon = null;
                state.couponDiscount = 0;
            });
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
    setDsCoupon,
    clearDsCoupon,
    updateDsQuantityLocal,
    updateDsSellingPriceLocal,
    dsCartLoadForUser,
} = dropshippingCartSlice.actions;

export default dropshippingCartSlice.reducer;
