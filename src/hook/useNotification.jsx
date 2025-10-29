import axios from "axios";
import { UrlBackend } from "../confic/urlExport";


// all notification get 
export const NotificationAllGet = async () => {
  try {
    const response = await axios.get(`${UrlBackend}/notification`,{
      withCredentials: true,
    });
    return response.data; 
  } catch (error) {
    console.error("Registration error:", error.response?.data || error.message);
    throw error; 
  }
};


//  mark single read
export const NotificationSingleRead = async (id) => {
  try {
    const response = await axios.put(`${UrlBackend}/notification/${id}/read`,{
      withCredentials: true,
    });
    return response.data; 
  } catch (error) {
    console.error("Registration error:", error.response?.data || error.message);
    throw error; 
  }
};

// mark-all-read
export const NotificationAllRead = async () => {
  try {
    const response = await axios.put(`${UrlBackend}/notification/mark-all-read`,{
      withCredentials: true,
    });
    return response.data; 
  } catch (error) {
    console.error("Registration error:", error.response?.data || error.message);
    throw error; 
  }
};

// delete
export const NotificationDelete = async (id) => {
  try {
    const response = await axios.delete(`${UrlBackend}/notification/${id}`,{
      withCredentials: true,
    });
    return response.data; 
  } catch (error) {
    console.error("Registration error:", error.response?.data || error.message);
    throw error; 
  }
};
