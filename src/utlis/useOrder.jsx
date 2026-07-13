import apiClient from "@/src/lib/axios";

/**
 * 🛒 Create a new order
 * Endpoint: POST /orders/create
 */
export const OrderCreate = async (formData) => {
    try {
        const response = await apiClient.post(`/orders/create`, formData, {
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
    const response = await apiClient.get(`/orders/admin/all`);
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
        const response = await apiClient.get(`/orders/my-orders`);
        return response.data;
    } catch (error) {
        console.error("Order fetch error:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * 📦 Get single order details
 * Endpoint: GET /orders/:id
 */
export const OrderGetDetails = async (orderId) => {
    try {
        const response = await apiClient.get(`/orders/${orderId}`);
        return response.data;
    } catch (error) {
        console.error("Order details fetch error:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * 📦 Get all orders for (admin only)
 * Endpoint: GET /orders/orders
 */
export const OrderAllGetAdmin = async () => {
    try {
        const response = await apiClient.get(`/orders/admin/all`);
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
        const response = await apiClient.put(
            `/orders/${orderId}/status`,
            { status },
            {
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
 * ⚙️ Update dropshipping order status with additional details (Admin only)
 * Endpoint: PUT /orders/dropshipping/:id/status
 */
export const DropshippingOrderUpdate = async (orderId, statusData) => {
    try {
        const response = await apiClient.put(
            `/orders/dropshipping/${orderId}/status`,
            statusData,
            {
                headers: { "Content-Type": "application/json" },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Dropshipping order update error:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * 📦 Get dropshipping order details with status history (Admin only)
 * Endpoint: GET /orders/dropshipping/:id
 */
export const GetDropshippingOrderDetails = async (orderId) => {
    try {
        const response = await apiClient.get(`/orders/dropshipping/${orderId}`);
        return response.data;
    } catch (error) {
        console.error("Dropshipping order details error:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * 📨 Send admin message to dropshipper on specific order
 * Endpoint: POST /orders/dropshipping/:id/message
 */
export const SendOrderMessage = async (orderId, message) => {
    try {
        const response = await apiClient.post(
            `/orders/dropshipping/${orderId}/message`,
            { message },
            {
                headers: { "Content-Type": "application/json" },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Send order message error:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * 🗑️ (Optional) Delete an order (if your backend supports it)
 * Endpoint: DELETE /orders/:id
 */
export const OrderDelete = async (orderId) => {
    try {
        const response = await apiClient.delete(`/orders/${orderId}`);
        return response.data;
    } catch (error) {
        console.error("Order delete error:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * ✏️ Update order key points (Admin only)
 * Endpoint: PUT /orders/dropshipping/:id/keypoints
 */
export const UpdateOrderKeyPoints = async (orderId, keyPoints) => {
    try {
        const response = await apiClient.put(
            `/orders/dropshipping/${orderId}/keypoints`,
            { keyPoints },
            {
                headers: { "Content-Type": "application/json" },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Update order key points error:", error.response?.data || error.message);
        throw error;
    }
};
