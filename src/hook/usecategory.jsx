import apiClient from "../lib/axios";
import { categoryGet } from "../redux/categorySlice";

// catagory add
export const CategoryCreate = async (formData,) => {
  try {
    const response = await apiClient.post(`/categories/create`, formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Category creation error:", error.response?.data || error.message);
    throw error;
  }
};

// catagory ALL GET
export const CategoryAllGet = async (dispatch, status) => {
  try {
    const url = status ? `/categories?status=${status}` : `/categories`;
    const response = await apiClient.get(url, {
      withCredentials: true,
    });
    if (dispatch) {
      dispatch(categoryGet(response.data));
    }
    return response.data;
  } catch (error) {
    if (error.code === 'ECONNREFUSED' || error.message?.includes('ECONNREFUSED')) {
      return { success: false, data: [], message: "Backend unreachable during build" };
    }
    console.error("Category fetch error:", error.response?.data || error.message);
    throw error;
  }
};


// uplosd categoti
export const CategoryUploade = async (formData, categoryId) => {
  try {
    const response = await apiClient.put(
      `/categories/${categoryId}`,
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

// delete category
export const CategoryDelete = async (categoryId) => {
  try {
    const response = await apiClient.delete(
      `/categories/${categoryId}`,
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
