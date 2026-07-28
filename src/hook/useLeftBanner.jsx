import apiClient from "../lib/axios";

// LeftBanner add
export const LeftBannerCreate = async (formData, ) => {
  try {
    const response = await apiClient.post(`/LeftBanner/create`, formData, {
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
    const response = await apiClient.get(`/LeftBanner/get`,  {
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
    const response = await apiClient.put(
      `/LeftBanner/${id}`, 
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

// toggle LeftBanner status
export const LeftBannerToggleActive = async (id) => {
  try {
    const response = await apiClient.patch(
      `/LeftBanner/${id}/toggle-active`,
      {},
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("LeftBanner toggle error:", error.response?.data || error.message);
    throw error;
  }
};

// delete LeftBanner
export const LeftBannerDelete = async (categoryId) => {
  try {
    const response = await apiClient.delete(
      `/LeftBanner/${categoryId}`, 
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
