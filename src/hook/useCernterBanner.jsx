import apiClient from "../lib/axios";

// CenterBanner add
export const CenterBannerCreate = async (formData, ) => {
  try {
    const response = await apiClient.post(`/CenterBanner/create`, formData, {
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
    const response = await apiClient.get(`/CenterBanner/get`,  {
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
    const response = await apiClient.put(
      `/CenterBanner/${id}`, 
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

// toggle CenterBanner status
export const CenterBannerToggleActive = async (id) => {
  try {
    const response = await apiClient.patch(
      `/CenterBanner/${id}/toggle-active`,
      {},
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("CenterBanner toggle error:", error.response?.data || error.message);
    throw error;
  }
};

// delete CenterBanner
export const CenterBannerDelete = async (categoryId) => {
  try {
    const response = await apiClient.delete(
      `/CenterBanner/${categoryId}`, 
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
