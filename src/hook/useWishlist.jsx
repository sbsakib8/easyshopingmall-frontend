// src/hook/useWishlist.js
import axios from "axios";
import { UrlBackend } from "../confic/urlExport";
import {
    wishlistAdd,
    wishlistClear,
    wishlistError,
    wishlistLoading,
    wishlistRemove,
    wishlistSet,
} from "../redux/wishlistSlice"; // ✅ make sure you add wishlistSet in your slice

// ✅ Get all wishlist products
export const getWishlistApi = async (dispatch) => {
    try {
        dispatch(wishlistLoading());

        const res = await axios.get(`${UrlBackend}/wishlist`, { withCredentials: true });

        const formatted = res.data.data.map((item) => ({
            id: item.productId?._id,
            name: item.productId?.name,
            image: item.productId?.image?.[0],
            price: item.productId?.price,
            discount: item.productId?.discount,
            rating: item.productId?.ratings,
            inStock: item.productId?.stock > 0,
            category: item.productId?.brand || "General",
            originalPrice: item.productId?.price / (1 - item.productId?.discount / 100),
            addedAt: item.addedAt,
        }));

        dispatch(wishlistSet(formatted));
    } catch (error) {
        console.error("Get wishlist error:", error.response?.data || error.message);
        dispatch(wishlistError(error.response?.data?.message || "Failed to load wishlist"));
    }
};

// ✅ Add product to wishlist
export const addToWishlistApi = async (productId, dispatch) => {
    try {
        dispatch(wishlistLoading());
        const response = await axios.post(
            `${UrlBackend}/wishlist/add`,
            { productId },
            { withCredentials: true }
        );
        dispatch(wishlistAdd(response.data.data));
    } catch (error) {
        console.error("Add wishlist error:", error.response?.data || error.message);
        dispatch(wishlistError(error.response?.data?.message || "Add failed"));
    }
};

// ✅ Remove product from wishlist
export const removeFromWishlistApi = async (productId, dispatch) => {
    try {
        await axios.delete(`${UrlBackend}/wishlist/remove/${productId}`, {
            withCredentials: true,
        });
        dispatch(wishlistRemove(productId));
    } catch (error) {
        console.error("Remove wishlist error:", error.response?.data || error.message);
        dispatch(wishlistError(error.response?.data?.message || "Remove failed"));
    }
};

// ✅ Clear wishlist
export const clearWishlistApi = async (dispatch) => {
    try {
        await axios.delete(`${UrlBackend}/wishlist/clear`, { withCredentials: true });
        dispatch(wishlistClear());
    } catch (error) {
        console.error("Clear wishlist error:", error.response?.data || error.message);
        dispatch(wishlistError(error.response?.data?.message || "Clear failed"));
    }
};
