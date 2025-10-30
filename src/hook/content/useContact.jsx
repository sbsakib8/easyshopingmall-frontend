import axios from "axios";
import { UrlBackend } from "../../confic/urlExport";


// Contact add 
export const ContactCreate = async (formData) => {
  try {
    const response = await axios.post(`${UrlBackend}/contact/create`,formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json"
      },
    });
    return response.data; 
  } catch (error) {
    console.error("contact error:", error.response?.data || error.message);
    throw error; 
  }
};

// Contact get all
export const ContactGet = async ( ) => {
  try {
    const response = await axios.get(`${UrlBackend}/contact/get`,{
      withCredentials: true,
      
    });
    return response.data; 
  } catch (error) {
    console.error("contact error:", error.response?.data || error.message);
    throw error; 
  }
};

// Contacy delete
export const ContactDelete = async (id) => {
  try {
    const response = await axios.delete(`${UrlBackend}/contact/${id}`,{
      withCredentials: true,
      
    });
    return response.data; 
  } catch (error) {
    console.error("contact error:", error.response?.data || error.message);
    throw error; 
  }
};