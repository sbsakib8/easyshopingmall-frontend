import axios from "axios";
import { UrlBackend } from "../confic/urlExport";
import { subcategoryGet } from "../redux/subcategorySlice";
// subcatagory add
export const SubCategoryCreate = async (formData,) => {
  try {
    const response = await axios.post(`${UrlBackend}/subcategories/create`, formData, {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Registration error:", error.response?.data || error.message);
    throw error;
  }
};

// subcatagory ALL GET
export const SubCategoryAllGet = async (dispatch) => {
  try {
    const response = await axios.get(`${UrlBackend}/subcategories`, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (dispatch) {
      dispatch(subcategoryGet(response.data));
    }
    return response.data;
  } catch (error) {
    console.error("SubCategory fetch error:", error.response?.data || error.message);
    throw error;
  }
};

// get one subcategoti
export const SubCategoryGetOne = async (formData, subcategoryId) => {
  try {
    const response = await axios.get(
      `${UrlBackend}/subcategories/${subcategoryId}`,
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

// uplosd subcategoti
export const SubCategoryUploade = async (formData, subcategoryId) => {
  try {
    const response = await axios.put(
      `${UrlBackend}/subcategories/${subcategoryId}`,
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

// delete 
export const SubCategoryDelete = async (subcategoryId) => {
  try {
    const response = await axios.delete(
      `${UrlBackend}/subcategories/${subcategoryId}`,
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
