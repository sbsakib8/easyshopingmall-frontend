import axios from "axios";
import { UrlBackend } from "../confic/urlExport";

// ✅ Create order from cart
export const OrderCreate = async (formData) => {
    try {
        const response = await axios.post(`${UrlBackend}/orders/manual`, formData, {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
        });
        return response.data; // { success, data: { ...order } }
    } catch (error) {
        console.error("Order creation error:", error.response?.data || error.message);
        throw error;
    }
};

export const submitManualPayment = async (data) => {
    try {
        const response = await axios.post(
            `${UrlBackend}/orders/manual-payment`,
            data,
            {
                withCredentials: true,
                headers: { "Content-Type": "application/json" },
            }
        );

        return response.data; // { success, order }
    } catch (error) {
        console.error(
            "Manual payment error:",
            error.response?.data || error.message
        );
        throw error;
    }
};


// ✅ Initialize SSLCommerz payment session
export const initPaymentSession = async (payload) => {
    try {
        const response = await axios.post(`${UrlBackend}/payment/initiate`, payload, {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
        });
        return response.data;
    } catch (error) {
        console.error("Payment init error:", error.response?.data || error.message);
        throw error;
    }
};

// export const OrderAllGet = async (formData,) => {
//     try {
//         const response = await axios.post(`${UrlBackend}/orders/get`, formData, {
//             withCredentials: true,
//             headers: {
//                 "Content-Type": "application/json", // crucial!
//             },
//         });
//         return response.data;
//     } catch (error) {
//         console.error("Registration error:", error.response?.data || error.message);
//         throw error;
//     }
// };

// update
// export const OrderUpdate = async (formData) => {
//     try {
//         const response = await axios.put(
//             `${UrlBackend}/orders/`,
//             formData,
//             {
//                 withCredentials: true,
//                 headers: { "Content-Type": "application/json" },
//             }
//         );
//         return response.data;
//     } catch (error) {
//         console.error("update error:", error.response?.data || error.message);
//         throw error;
//     }