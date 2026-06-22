import apiClient from "../lib/axios";

/**
 * Fetch active coupons applicable to a given product.
 * @param {string} productId - MongoDB ObjectId of the product
 * @returns {Promise<Array>} Array of coupon objects
 */
export const getProductCouponsApi = async (productId) => {
    try {
        if (!productId) return [];
        const res = await apiClient.get(`/coupon/product/${productId}`, {
            withCredentials: true,
        });
        return res.data?.data || [];
    } catch (error) {
        console.error("Get product coupons error:", error?.response?.data || error.message);
        return [];
    }
};
