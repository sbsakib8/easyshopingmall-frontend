import axios from "axios";
import { UrlBackend } from "../confic/urlExport";

// RightBanner add
export const RightBannerCreate = async (formData, ) => {
  try {
    const response = await axios.post(`${UrlBackend}/RightBanner/create`, formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data; 
  } catch (error) {
    console.error("RightBanner error:", error.response?.data || error.message);
    throw error; 
  }
};

// RightBanner ALL GET
export const RightBannerAllGet = async () => {
  try {
    const response = await axios.get(`${UrlBackend}/RightBanner/get`,  {
      withCredentials: true,
    });
    return response.data; 
  } catch (error) {
    console.error("RightBanner error:", error.response?.data || error.message);
    throw error; 
  }
};


// uplosd RightBanner
export const RightBannerUploade = async (formData, id) => {
  try {
    const response = await axios.put(
      `${UrlBackend}/RightBanner/${id}`, 
      formData, 
      {
        withCredentials: true, 
      }
    );
    return response.data;
  } catch (error) {
    console.error("RightBanner update error:", error.response?.data || error.message);
    throw error;
  }
};

// delete RightBanner
export const RightBannerDelete = async (categoryId) => {
  try {
    const response = await axios.delete(
      `${UrlBackend}/RightBanner/${categoryId}`, 
      {
        withCredentials: true, 
      }
    );
    return response.data;
  } catch (error) {
    console.error("RightBanner update error:", error.response?.data || error.message);
    throw error;
  }
};
