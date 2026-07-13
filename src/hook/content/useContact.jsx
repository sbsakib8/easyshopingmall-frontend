import apiClient from "../../lib/axios";


// Contact add 
export const ContactCreate = async (formData) => {
  try {
    const response = await apiClient.post(`/contact/create`,formData, {
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
    const response = await apiClient.get(`/contact/get`,{
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
    const response = await apiClient.delete(`/contact/${id}`,{
      withCredentials: true,
      
    });
    return response.data; 
  } catch (error) {
    console.error("contact error:", error.response?.data || error.message);
    throw error; 
  }
};