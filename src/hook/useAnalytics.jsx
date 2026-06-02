import axios from "axios";
import { UrlBackend } from "../confic/urlExport";

export function getAnalyticsDateRange(period) {
  const endDate = new Date();
  const start = new Date();
  switch (period) {
    case "24h":
      start.setHours(start.getHours() - 24);
      break;
    case "7d":
      start.setDate(start.getDate() - 7);
      break;
    case "90d":
      start.setDate(start.getDate() - 90);
      break;
    case "1y":
      start.setFullYear(start.getFullYear() - 1);
      break;
    case "30d":
    default:
      start.setDate(start.getDate() - 30);
      break;
  }
  return {
    startDate: start.toISOString(),
    endDate: endDate.toISOString(),
  };
}

async function fetchAnalytics(path, startDate, endDate) {
  const params = {};
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;

  const response = await axios.get(`${UrlBackend}/analytics/${path}`, {
    params,
    withCredentials: true,
  });
  return response.data;
}

export const getCustomerAnalytics = async (startDate, endDate) => {
  try {
    return await fetchAnalytics("customer/summary", startDate, endDate);
  } catch (error) {
    console.error(
      "Customer Analytics Error:",
      error.response?.data || error.message
    );
    return { success: false, data: null };
  }
};

export const getProductAnalyticsSummary = async (startDate, endDate) => {
  try {
    return await fetchAnalytics("product/summary", startDate, endDate);
  } catch (error) {
    console.error(
      "Product Analytics Error:",
      error.response?.data || error.message
    );
    return { success: false, data: null };
  }
};

export const getTrafficAnalytics = async (startDate, endDate) => {
  try {
    return await fetchAnalytics("traffic/summary", startDate, endDate);
  } catch (error) {
    console.error(
      "Traffic Analytics Error:",
      error.response?.data || error.message
    );
    return { success: false, data: null };
  }
};
