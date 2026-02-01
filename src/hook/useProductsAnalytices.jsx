// Get products analytics 
export const getProductsAnalytics = async () => {
  try {
    const response = await axios.get(`${UrlBackend}/analytics/product/summary`, {
      withCredentials: true,
    });
    return response.data || [];
  } catch (error) {
    console.error("Get Products Analytics Error:", error.response?.data || error.message);
    return [];
  }
};