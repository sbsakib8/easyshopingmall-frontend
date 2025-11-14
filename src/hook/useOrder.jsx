import axios from "axios";
import { UrlBackend } from "../confic/urlExport";

// order
export const OrderCreate = async (formData,) => {
    try {
        const response = await axios.post(`${UrlBackend}/orders/create`, formData, {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
        });
        return response.data;
    } catch (error) {
        console.error("Registration error:", error.response?.data || error.message);
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