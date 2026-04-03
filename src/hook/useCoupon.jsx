import axios from "axios";
import { UrlBackend } from "../confic/urlExport";

// Apply coupon code
export const applyCouponCode = async (data) => {
    try {
        const response = await axios.post(`${UrlBackend}/coupon/apply`, data, {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
        });
        return response.data; // { success, message, discountAmount, coupon }
    } catch (error) {
        console.error("Coupon apply error:", error.response?.data || error.message);
        throw error;
    }
};

// Create coupon code (admin)
export const createCouponCode = async (data) => {
    try {
        const response = await axios.post(`${UrlBackend}/coupon/create`, data, {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
        });
        return response.data;
    } catch (error) {
        console.error("Coupon create error:", error.response?.data || error.message);
        throw error;
    }
};

// Get all coupons (admin)
export const getAllCoupons = async () => {
    try {
        const response = await axios.get(`${UrlBackend}/coupon/`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error("Coupon fetch error:", error.response?.data || error.message);
        throw error;
    }
};

// Delete coupon (admin)
export const deleteCoupon = async (id) => {
    try {
        const response = await axios.delete(`${UrlBackend}/coupon/delete/${id}`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error("Coupon delete error:", error.response?.data || error.message);
        throw error;
    }
};

// Update coupon (admin)
export const updateCouponCode = async (id, data) => {
    try {
        const response = await axios.patch(`${UrlBackend}/coupon/update/${id}`, data, {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
        });
        return response.data;
    } catch (error) {
        console.error("Coupon update error:", error.response?.data || error.message);
        throw error;
    }
};
