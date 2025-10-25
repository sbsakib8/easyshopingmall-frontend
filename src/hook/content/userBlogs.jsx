import axios from "axios";
import { UrlBackend } from "../../confic/urlExport";

// blog add
export const BlogCreate = async (formData, ) => {
  try {
    const response = await axios.post(`${UrlBackend}/blog/create`, formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data; 
  } catch (error) {
    console.error("blog error:", error.response?.data || error.message);
    throw error; 
  }
};

// blog ALL GET
export const BlogAllGet = async () => {
  try {
    const response = await axios.get(`${UrlBackend}/blog/get`,  {
      withCredentials: true,
    });
    return response.data; 
  } catch (error) {
    console.error("blog error:", error.response?.data || error.message);
    throw error; 
  }
};


// uplosd blog
export const blogUploade = async (formData, id) => {
  try {
    const response = await axios.put(
      `${UrlBackend}/blog/${id}`, 
      formData, 
      {
        withCredentials: true, 
      }
    );
    return response.data;
  } catch (error) {
    console.error("blog update error:", error.response?.data || error.message);
    throw error;
  }
};

// delete blog
export const blogDelete = async (categoryId) => {
  try {
    const response = await axios.delete(
      `${UrlBackend}/blog/${categoryId}`, 
      {
        withCredentials: true, 
      }
    );
    return response.data;
  } catch (error) {
    console.error("blog update error:", error.response?.data || error.message);
    throw error;
  }
};
