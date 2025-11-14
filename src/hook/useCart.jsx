// src/hooks/useCart.js
import axios from "axios";
import { UrlBackend } from "../confic/urlExport";
import {
    cartAdd,
    cartClear,
    cartError,
    cartLoading,
    cartRemove,
    cartSuccess,
    cartUpdate,
} from "../redux/cartSlice";

// ✅ Add to cart
export const addToCartApi = async (productData, dispatch) => {
    try {
        dispatch(cartLoading());
        const res = await axios.post(`${UrlBackend}/cart/add`, productData, {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
        });
        dispatch(cartAdd(res.data.data));
    } catch (error) {
        dispatch(cartError(error.response?.data?.message || "Add to cart failed"));
    }
};

// ✅ Get all cart items for a user
export const getCartApi = async (userId, dispatch) => {
    try {
        dispatch(cartLoading());
        console.log("Calling API:", `${UrlBackend}/cart/${userId}`);

        const res = await axios.get(`${UrlBackend}/cart/${userId}`, {
            withCredentials: true,
        });

        console.log("API Response:", res.data);
        dispatch(cartSuccess(res.data.data.products || []));
    } catch (error) {
        console.error("Cart API Error:", error);
        dispatch(cartError(error.response?.data?.message || "Get cart failed"));
    }
};



// ✅ Update cart item (e.g. quantity)
export const updateCartItemApi = async (updateData, dispatch) => {
    try {
        dispatch(cartLoading());
        const res = await axios.put(`${UrlBackend}/cart/update`, updateData, {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
        });
        dispatch(cartUpdate(res.data.data));
    } catch (error) {
        dispatch(cartError(error.response?.data?.message || "Update cart failed"));
    }
};

// ✅ Remove a specific item
export const removeCartItemApi = async (userId, productId, dispatch) => {
    try {
        dispatch(cartLoading());
        await axios.delete(`${UrlBackend}/cart/remove/${userId}/${productId}`, {
            withCredentials: true,
        });
        dispatch(cartRemove(productId));
    } catch (error) {
        dispatch(cartError(error.response?.data?.message || "Remove cart failed"));
    }
};

// ✅ Clear all cart items
export const clearCartApi = async (userId, dispatch) => {
    try {
        dispatch(cartLoading());
        await axios.delete(`${UrlBackend}/cart/clear/${userId}`, {
            withCredentials: true,
        });
        dispatch(cartClear());
    } catch (error) {
        dispatch(cartError(error.response?.data?.message || "Clear cart failed"));
    }
};
