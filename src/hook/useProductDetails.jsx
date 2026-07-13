import apiClient from "../lib/axios";

// Helper to validate MongoDB ObjectId
const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

// Fetch single product details
export const getProductDetailsApi = async (productId) => {
    try {
        if (!productId || !isValidObjectId(productId)) {
            console.warn(`Invalid Product ID provided: ${productId}`);
            return null;
        }
        const res = await apiClient.get(`/products/get-product-details/${productId}`, {
            withCredentials: true,
        });
        return res.data?.data || null;
    } catch (error) {
        console.error("Get product details error:", error?.response?.data || error.message || error);
        return null; // Return null instead of throwing to avoid crashing server-components
    }
};
