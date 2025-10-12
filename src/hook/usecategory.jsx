import axios from "axios";
import { UrlBackend } from "../confic/urlExport";
import { categoryGet } from "../redux/categorySlice";

// catagory add
export const CategoryCreate = async (formData, ) => {
  try {
    const response = await axios.post(`${UrlBackend}/categories/create`, formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data; 
  } catch (error) {
    console.error("Registration error:", error.response?.data || error.message);
    throw error; 
  }
};

// catagory ALL GET
export const CategoryAllGet = async (dispatch ) => {
  try {
    const response = await axios.get(`${UrlBackend}/categories`,  {
      withCredentials: true,
    });
    dispatch(categoryGet(response.data))
    return response.data; 
   
  } catch (error) {
    console.error("Registration error:", error.response?.data || error.message);
    throw error; 
  }
};


// uplosd categoti
export const CategoryUploade = async (formData, categoryId) => {
  try {
    const response = await axios.put(
      `${UrlBackend}/categories/${categoryId}`, 
      formData, 
      {
        withCredentials: true, 
      }
    );
    return response.data;
  } catch (error) {
    console.error("Category update error:", error.response?.data || error.message);
    throw error;
  }
};

export const CategoryDelete = async (categoryId) => {
  try {
    const response = await axios.delete(
      `${UrlBackend}/categories/${categoryId}`, 
      {
        withCredentials: true, 
      }
    );
    return response.data;
  } catch (error) {
    console.error("Category update error:", error.response?.data || error.message);
    throw error;
  }
};
