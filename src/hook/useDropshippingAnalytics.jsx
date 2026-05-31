import axios from "axios";
import { UrlBackend } from "../confic/urlExport";

// Get dropshipping analytics
export const getDropshippingAnalytics = async (startDate, endDate) => {
  try {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await axios.get(
      `${UrlBackend}/analytics/dropshipping/summary`,
      {
        params,
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Dropshipping Analytics Error:",
      error.response?.data || error.message
    );
    return { success: false, data: null };
  }
};

// Get personal dropshipping analytics for logged in user
export const getMyDropshippingAnalytics = async (startDate, endDate) => {
  try {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await axios.get(
      `${UrlBackend}/analytics/dropshipping/my-summary`,
      {
        params,
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "My Dropshipping Analytics Error:",
      error.response?.data || error.message
    );
    return { success: false, data: null };
  }
};
