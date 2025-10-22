import axios from "axios";
import { UrlBackend } from "../confic/urlExport";

// LeftBanner add
export const LeftBannerCreate = async (formData, ) => {
  try {
    const response = await axios.post(`${UrlBackend}/LeftBanner/create`, formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data; 
  } catch (error) {
    console.error("LeftBanner error:", error.response?.data || error.message);
    throw error; 
  }
};

// LeftBanner ALL GET
export const LeftBannerAllGet = async () => {
  try {
    const response = await axios.get(`${UrlBackend}/LeftBanner/get`,  {
      withCredentials: true,
    });
    return response.data; 
  } catch (error) {
    console.error("LeftBanner error:", error.response?.data || error.message);
    throw error; 
  }
};


// uplosd LeftBanner
export const LeftBannerUploade = async (formData, id) => {
  try {
    const response = await axios.put(
      `${UrlBackend}/LeftBanner/${id}`, 
      formData, 
      {
        withCredentials: true, 
      }
    );
    return response.data;
  } catch (error) {
    console.error("LeftBanner update error:", error.response?.data || error.message);
    throw error;
  }
};

// delete LeftBanner
export const LeftBannerDelete = async (categoryId) => {
  try {
    const response = await axios.delete(
      `${UrlBackend}/LeftBanner/${categoryId}`, 
      {
        withCredentials: true, 
      }
    );
    return response.data;
  } catch (error) {
    console.error("LeftBanner update error:", error.response?.data || error.message);
    throw error;
  }
};
