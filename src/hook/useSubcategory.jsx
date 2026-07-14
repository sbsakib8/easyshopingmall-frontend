import apiClient from "../lib/axios";
import { subcategoryGet } from "../redux/subcategorySlice";
// subcatagory add
export const SubCategoryCreate = async (formData,) => {
  try {
    const response = await apiClient.post(`/subcategories/create`, formData, {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (response) {
      return response.data;
    }
  } catch (error) {
    if (error.code === 'ECONNREFUSED' || error.message?.includes('ECONNREFUSED')) {
      return { success: false, data: [], message: "Backend unreachable during build" };
    }
    console.error("Subcategory fetch error:", error.response?.data || error.message);
    throw error;
  }
};

// subcatagory ALL GET
export const SubCategoryAllGet = async (dispatch, filterType, status) => {
  try {
    const url = filterType 
      ? `/subcategories?filterType=${filterType}&status=${status || "all"}` 
      : `/subcategories?status=${status || "all"}`;
    const response = await apiClient.get(url, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (dispatch && !filterType) {
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
    const response = await apiClient.get(
      `/subcategories/${subcategoryId}`,
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
    const response = await apiClient.put(
      `/subcategories/${subcategoryId}`,
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
    const response = await apiClient.delete(
      `/subcategories/${subcategoryId}`,
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
