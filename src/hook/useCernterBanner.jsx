import axios from "axios";
import { UrlBackend } from "../confic/urlExport";

// CenterBanner add
export const CenterBannerCreate = async (formData, ) => {
  try {
    const response = await axios.post(`${UrlBackend}/CenterBanner/create`, formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data; 
  } catch (error) {
    console.error("CenterBanner error:", error.response?.data || error.message);
    throw error; 
  }
};

// CenterBanner ALL GET
export const CenterBannerAllGet = async () => {
  try {
    const response = await axios.get(`${UrlBackend}/CenterBanner/get`,  {
      withCredentials: true,
    });
    return response.data; 
  } catch (error) {
    console.error("CenterBanner error:", error.response?.data || error.message);
    throw error; 
  }
};


// uplosd CenterBanner
export const CenterBannerUploade = async (formData, id) => {
  try {
    const response = await axios.put(
      `${UrlBackend}/CenterBanner/${id}`, 
      formData, 
      {
        withCredentials: true, 
      }
    );
    return response.data;
  } catch (error) {
    console.error("CenterBanner update error:", error.response?.data || error.message);
    throw error;
  }
};

// delete CenterBanner
export const CenterBannerDelete = async (categoryId) => {
  try {
    const response = await axios.delete(
      `${UrlBackend}/CenterBanner/${categoryId}`, 
      {
        withCredentials: true, 
      }
    );
    return response.data;
  } catch (error) {
    console.error("CenterBanner update error:", error.response?.data || error.message);
    throw error;
  }
};
