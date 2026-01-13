import axios from "axios";
import { UrlBackend } from "../confic/urlExport";

/**
 * 🛒 Create a new order
 * Endpoint: POST /orders/create
 */
export const OrderCreate = async (formData) => {
    try {
        const response = await axios.post(`${UrlBackend}/orders/create`, formData, {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
        });
        return response.data;
    } catch (error) {
        console.error("Order creation error:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * 📦 Get all orders (Admin only)
 * Endpoint: GET /orders/admin/all
 */
export const OrderAllAdminGet = async () => {
  try {
    const response = await axios.get(`${UrlBackend}/orders/admin/all`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Admin order fetch error:", error.response?.data || error.message);
    throw error;
  }
};


/**
 * 📦 Get all orders for logged-in user
 * Endpoint: GET /orders/my-orders
 */
export const OrderAllGet = async () => {
    try {
        const response = await axios.get(`${UrlBackend}/orders/my-orders`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error("Order fetch error:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * 📦 Get all orders for (admin only)
 * Endpoint: GET /orders/orders
 */
export const OrderAllGetAdmin = async () => {
    try {
        const response = await axios.get(`${UrlBackend}/orders/admin/all`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error("Order fetch error:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * ⚙️ Update order status (Admin only)
 * Endpoint: PUT /orders/:id/status
 */
export const OrderUpdate = async (orderId, status) => {
    try {
        const response = await axios.put(
            `${UrlBackend}/orders/${orderId}/status`,
            { status },
            {
                withCredentials: true,
                headers: { "Content-Type": "application/json" },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Order update error:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * 🗑️ (Optional) Delete an order (if your backend supports it)
 * Endpoint: DELETE /orders/:id
 */
export const OrderDelete = async (orderId) => {
    try {
        const response = await axios.delete(`${UrlBackend}/orders/${orderId}`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error("Order delete error:", error.response?.data || error.message);
        throw error;
    }
};
