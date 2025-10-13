import axios from "axios";
import { UrlBackend } from "../confic/urlExport";

// product uploard
export const ProductCreate = async (formData, ) => {
  try {
    const response = await axios.post(`${UrlBackend}/products/create`, formData, {
      withCredentials: true,
       headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data; 
  } catch (error) {
    console.error("Registration error:", error.response?.data || error.message);
    throw error; 
  }
};


// all product get 
export const ProductAllGet = async (formData, ) => {
  try {
    const response = await axios.post(`${UrlBackend}/products/get`, formData, {
      withCredentials: true,
    });
    return response.data; 
  } catch (error) {
    console.error("Registration error:", error.response?.data || error.message);
    throw error; 
  }
};
