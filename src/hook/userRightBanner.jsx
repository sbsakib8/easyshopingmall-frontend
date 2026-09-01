import apiClient from "../lib/axios";

// RightBanner add
export const RightBannerCreate = async (formData, ) => {
  try {
    const response = await apiClient.post(`/RightBanner/create`, formData, {
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
    const response = await apiClient.get(`/RightBanner/get`,  {
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
    const response = await apiClient.put(
      `/RightBanner/${id}`, 
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

// toggle RightBanner status
export const RightBannerToggleActive = async (id) => {
  try {
    const response = await apiClient.patch(
      `/RightBanner/${id}/toggle-active`,
      {},
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("RightBanner toggle error:", error.response?.data || error.message);
    throw error;
  }
};

// delete RightBanner
export const RightBannerDelete = async (categoryId) => {
  try {
    const response = await apiClient.delete(
      `/RightBanner/${categoryId}`, 
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
