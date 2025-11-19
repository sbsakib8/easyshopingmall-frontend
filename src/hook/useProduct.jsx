import axios from "axios";
import { UrlBackend } from "../confic/urlExport";

// product uploard
export const ProductCreate = async (formData,) => {
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
export const ProductAllGet = async (formData,) => {
  try {
    const response = await axios.post(`${UrlBackend}/products/get`, formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json", // crucial!
      },
    });
    return response.data;
  } catch (error) {
    console.error("Registration error:", error.response?.data || error.message);
    throw error;
  }
};


//  delete
export const ProductDelete = async (_id) => {
  try {
    const response = await axios.delete(`${UrlBackend}/products/delete-product`, {
      data: { _id },
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Delete error:", error.response?.data || error.message);
    throw error;
  }
};


// update
export const ProductUpdate = async (formData) => {
  try {
    const response = await axios.put(
      `${UrlBackend}/products/update-product-details`,
      formData,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    console.error("update error:", error.response?.data || error.message);
    throw error;
  }
};

// sockeet io product update
export const ProductNotification = async (formData) => {
  try {
    const response = await axios.post(
      `${UrlBackend}/notification`,
      formData,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    console.error("update error:", error.response?.data || error.message);
    throw error;
  }
};

