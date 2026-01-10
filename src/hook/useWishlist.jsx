// src/hook/useWishlist.js
import axios from "axios";
import { UrlBackend } from "../confic/urlExport";
import {
    wishlistAdd,
    wishlistClear,
    wishlistError,
    wishlistLoading,
    wishlistSet
} from "../redux/wishlistSlice"; // ✅ make sure you add wishlistSet in your slice

// ✅ Get all wishlist products
export const getWishlistApi = async (dispatch) => {
    try {
        dispatch(wishlistLoading());

        const res = await axios.get(`${UrlBackend}/wishlist`, { withCredentials: true });


        const formatted = res.data.data.map((item) => {
            const product = item.productId;

            return {
                id: product?._id,
                name: product?.productName,
                image: product?.images?.[0],
                price: product?.price,
                discount: product?.discount,
                rating: product?.ratings,
                inStock: (product?.productStock || 0) > 0,
                category: product?.brand || "General",

                // Only if discount exists
                originalPrice: product?.discount
                    ? Math.round(product.price / (1 - product.discount / 100))
                    : product?.price,

                addedAt: item.addedAt,
            };
        });

        dispatch(wishlistSet(formatted));
    } catch (error) {
        console.error("Get wishlist error:", error?.response?.data || error.message);
        dispatch(
            wishlistError(error?.response?.data?.message || "Failed to load wishlist")
        );
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

export const removeFromWishlistApi = async (productId, dispatch) => {
    try {
        dispatch(wishlistLoading());

        await axios.delete(`${UrlBackend}/wishlist/remove/${productId}`, {
            withCredentials: true,
        });

        // 🔥 Immediately refetch from backend
        await getWishlistApi(dispatch);

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
