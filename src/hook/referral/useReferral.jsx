import axios from "axios";
import { UrlBackend } from "../../confic/urlExport";

// Get Referral Settings
export const ReferralGet = async () => {
  try {
    const response = await axios.get(`${UrlBackend}/referral/get`, {
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
    const response = await axios.put(`${UrlBackend}/referral/update`, formData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Referral settings update error:", error.response?.data || error.message);
    throw error;
  }
};
