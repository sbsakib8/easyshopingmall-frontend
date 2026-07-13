import apiClient from "../../lib/axios";

// blog add
export const BlogCreate = async (formData, ) => {
  try {
    const response = await apiClient.post(`/blog/create`, formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data; 
  } catch (error) {
    console.error("Blog creation error:", error.response?.data || error.message);
    throw error; 
  }
};

// blog ALL GET
export const BlogAllGet = async () => {
  try {
    const response = await apiClient.get(`/blog/get`,  {
      withCredentials: true,
    });
    return response.data; 
  } catch (error) {
    if (error.code === 'ECONNREFUSED' || error.message?.includes('ECONNREFUSED')) {
      return { success: false, data: [], blogs: [], message: "Backend unreachable during build" };
    }
    console.error("Blog fetch error:", error.response?.data || error.message);
    throw error; 
  }
};


// uplosd blog
export const blogUploade = async (formData, id) => {
  try {
    const response = await apiClient.put(
      `/blog/${id}`, 
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
    const response = await apiClient.delete(
      `/blog/${categoryId}`, 
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
