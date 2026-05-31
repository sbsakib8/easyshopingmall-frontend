import axios from "axios";
import { UrlBackend } from "../confic/urlExport";

/**
 * Fetch active coupons applicable to a given product.
 * @param {string} productId - MongoDB ObjectId of the product
 * @returns {Promise<Array>} Array of coupon objects
 */
export const getProductCouponsApi = async (productId) => {
    try {
        if (!productId) return [];
        const res = await axios.get(`${UrlBackend}/coupon/product/${productId}`, {
            withCredentials: true,
        });
        return res.data?.data || [];
    } catch (error) {
        console.error("Get product coupons error:", error?.response?.data || error.message);
        return [];
    }
};
