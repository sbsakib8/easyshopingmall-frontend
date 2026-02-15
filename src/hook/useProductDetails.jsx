import axios from "axios";
import { UrlBackend } from "../confic/urlExport";

// Helper to validate MongoDB ObjectId
const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

// Fetch single product details
export const getProductDetailsApi = async (productId) => {
    try {
        if (!productId || !isValidObjectId(productId)) {
            console.warn(`Invalid Product ID provided: ${productId}`);
            return null;
        }
        // Backend expects productId as a URL param: POST /products/get-product-details/:productId
        const res = await axios.post(`${UrlBackend}/products/get-product-details/${productId}`, null, {
            withCredentials: true,
        });
        return res.data?.data || null;
    } catch (error) {
        console.error("Get product details error:", error?.response?.data || error.message || error);
        return null; // Return null instead of throwing to avoid crashing server-components
    }
};
