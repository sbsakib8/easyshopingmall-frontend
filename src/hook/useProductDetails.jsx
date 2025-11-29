import axios from "axios";
import { UrlBackend } from "../confic/urlExport";

// Fetch single product details
export const getProductDetailsApi = async (productId) => {
    try {
        if (!productId) return null;
        // Backend expects productId as a URL param: POST /products/get-product-details/:productId
        const res = await axios.post(`${UrlBackend}/products/get-product-details/${productId}`, null, {
            withCredentials: true,
        });
        return res.data?.data || null;
    } catch (error) {
        console.error("Get product details error:", error?.response?.data || error.message || error);
        throw error;
    }
};
