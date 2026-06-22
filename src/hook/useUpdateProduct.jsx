import apiClient from "../lib/axios";

// Update product quantity in cart
export const updateProductQuantityApi = async (updateData, dispatch) => {
    try {
        const res = await apiClient.put(`/cart/update`, updateData, {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
        });
        return res.data;
    } catch (error) {
        throw error.response?.data?.message || "Update failed";
    }
};

// Increase product quantity
export const increaseProductQuantity = async (userId, productId, currentQuantity, dispatch) => {
    try {
        const newQuantity = currentQuantity + 1;
        const res = await updateProductQuantityApi({
            userId,
            productId,
            quantity: newQuantity
        }, dispatch);
        return res;
    } catch (error) {
        throw error;
    }
};

// Decrease product quantity
export const decreaseProductQuantity = async (userId, productId, currentQuantity, dispatch) => {
    try {
        const newQuantity = Math.max(1, currentQuantity - 1);
        const res = await updateProductQuantityApi({
            userId,
            productId,
            quantity: newQuantity
        }, dispatch);
        return res;
    } catch (error) {
        throw error;
    }
};
