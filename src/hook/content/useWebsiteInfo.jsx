import axios from "axios";
import { UrlBackend } from "../../confic/urlExport";

// websiteinfo add
export const WebsiteinfoCreate = async (formData, ) => {
  try {
    const response = await axios.post(`${UrlBackend}/websiteinfo/create`, formData, {
      withCredentials: true,
    });
    return response.data; 
  } catch (error) {
    console.error("websiteinfo error:", error.response?.data || error.message);
    throw error; 
  }
};

// websiteinfo ALL GET
export const WebsiteinfoAllGet = async () => {
  try {
    const response = await axios.get(`${UrlBackend}/websiteinfo/get`,  {
      withCredentials: true,
    });
    return response.data; 
  } catch (error) {
    console.error("websiteinfo error:", error.response?.data || error.message);
    throw error; 
  }
};


// uplosd websiteinfo
export const WebsiteinfoUploade = async (formData, id) => {
  try {
    const response = await axios.put(
      `${UrlBackend}/websiteinfo/${id}`, 
      formData, 
      {
        withCredentials: true, 
      }
    );
    return response.data;
  } catch (error) {
    console.error("websiteinfo update error:", error.response?.data || error.message);
    throw error;
  }
};

// delete websiteinfo
export const WebsiteinfoDelete = async (id) => {
  try {
    const response = await axios.delete(
      `${UrlBackend}/websiteinfo/${id}`, 
      {
        withCredentials: true, 
      }
    );
    return response.data;
  } catch (error) {
    console.error("websiteinfo update error:", error.response?.data || error.message);
    throw error;
  }
};
