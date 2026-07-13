import apiClient from "../../lib/axios";

// Get Referral Settings
export const ReferralGet = async () => {
  try {
    const response = await apiClient.get(`/referral/get`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Referral settings fetch error:", error.response?.data || error.message);
    throw error;
  }
};

// Update Referral Settings
export const ReferralUpdate = async (formData) => {
  try {
    const response = await apiClient.put(`/referral/update`, formData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Referral settings update error:", error.response?.data || error.message);
    throw error;
  }
};
