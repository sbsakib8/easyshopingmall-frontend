import axios from "axios";
import { UrlBackend } from "../confic/urlExport";
import {
    cartAdd,
    cartClear,
    cartError,
    cartLoading,
    cartRemove,
    cartSuccess,
    cartUpdate
} from "../redux/cartSlice";

// ------------------------ GET CART ------------------------
export const getCartApi = async (userId, dispatch) => {
    try {
        dispatch(cartLoading());

        const res = await axios.get(`${UrlBackend}/cart/${userId}`, {
            withCredentials: true,
        });

        dispatch(cartSuccess(res.data.data.products || []));
    } catch (error) {
        dispatch(cartError(error.response?.data?.message || "Get cart failed"));
    }
};

// ------------------------ ADD ------------------------
export const addToCartApi = async (productData, dispatch) => {
    try {
        const res = await axios.post(`${UrlBackend}/cart/add`, productData, {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
        });
        dispatch(cartAdd(res.data.data));
    } catch (error) {
        dispatch(cartError(error.response?.data?.message || "Add to cart failed"));
    }
};

// ------------------------ UPDATE ------------------------
export const updateCartItemApi = async (updateData, dispatch) => {
    try {
        // backend update only
        const res = await axios.put(`${UrlBackend}/cart/update`, updateData, {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
        });

        dispatch(cartUpdate(res.data.data));
    } catch (error) {
        dispatch(cartError(error.response?.data?.message || "Update cart failed"));
    }
};

// ------------------------ REMOVE ------------------------
export const removeCartItemApi = async (userId, productId, dispatch) => {
    try {
        await axios.delete(`${UrlBackend}/cart/remove/${userId}/${productId}`, {
            withCredentials: true,
        });

        dispatch(cartRemove(productId));
    } catch (error) {
        dispatch(cartError(error.response?.data?.message || "Remove cart failed"));
    }
};

// ------------------------ CLEAR ------------------------
export const clearCartApi = async (userId, dispatch) => {
    try {
        await axios.delete(`${UrlBackend}/cart/clear/${userId}`, {
            withCredentials: true,
        });
        dispatch(cartClear());
    } catch (error) {
        dispatch(cartError(error.response?.data?.message || "Clear cart failed"));
    }
};
