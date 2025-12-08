import axios from "axios";
import { UrlBackend } from "../confic/urlExport";

// HomeBanner add
export const HomeBannerCreate = async (formData, ) => {
  try {
    const response = await axios.post(`${UrlBackend}/homeBannerRoutes/create`, formData, {
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

// HomeBanner ALL GET
export const HomeBannerAllGet = async () => {
  try {
    const response = await axios.get(`${UrlBackend}/homeBannerRoutes/get`,  {
      withCredentials: true,
    });
    return response.data; 
  } catch (error) {
    console.error("Registration error:", error.response?.data || error.message);
    throw error; 
  }
};


// uplosd HomeBanner
export const HomeBannerUploade = async (formData, id) => {
  try {
    const response = await axios.put(
      `${UrlBackend}/homeBannerRoutes/${id}`, 
      formData, 
      {
        withCredentials: true, 
      }
    );
    return response.data;
  } catch (error) {
    console.error("HomeBanner update error:", error.response?.data || error.message);
    throw error;
  }
};

// delete HomeBanner
export const HomeBannerDelete = async (categoryId) => {
  try {
    const response = await axios.delete(
      `${UrlBackend}/homeBannerRoutes/${categoryId}`, 
      {
        withCredentials: true, 
      }
    );
    return response.data;
  } catch (error) {
    console.error("HomeBanner update error:", error.response?.data || error.message);
    throw error;
  }
};
