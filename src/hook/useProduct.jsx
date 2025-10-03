import axios from "axios";
import { UrlBackend } from "../confic/urlExport";

// signin
export const ProductCreate = async (formData, ) => {
  try {
    const response = await axios.post(`${UrlBackend}/products/create`, formData, {
      withCredentials: true,
    });
    return response.data; 
  } catch (error) {
    console.error("Registration error:", error.response?.data || error.message);
    throw error; 
  }
};
