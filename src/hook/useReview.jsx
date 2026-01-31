import axios from "axios";
import { UrlBackend } from "../confic/urlExport";

// 1️⃣ Submit a new review (status: pending)
export const submitReview = async (productId, reviewData) => {
  try {
    
    const response = await axios.post(`${UrlBackend}/review/${productId}`, reviewData, {
      withCredentials: true,
      headers: { 
        "Content-Type": "application/json"
      },
    });

    return response.data;
  } catch (error) {
    console.error("=== Submit Review Error ===");
    console.error("Status:", error.response?.status);
    console.error("Status Text:", error.response?.statusText);
    console.error("Error Data:", error.response?.data);
    console.error("Error Message:", error.message);
    console.error("Full Error:", error);
    throw error;
  }
};

// 6️⃣ Get all reviews (admin - approved + pending + rejected)
export const getAllReviews = async () => {
  try {
    const response = await axios.get(`${UrlBackend}/review/admin/all`, {
      withCredentials: true,
    });
    return response.data.reviews || [];
  } catch (error) {
    console.error("Get All Reviews Error:", error.response?.data || error.message);
    return [];
  }
};


// 2️⃣ Get all approved reviews for a product
export const getApprovedReviews = async (productId) => {
  try {
    const response = await axios.get(`${UrlBackend}/review/${productId}`);
    return response.data.reviews || [];
  } catch (error) {
    console.error("Get Approved Reviews Error:", error.response?.data || error.message);
    return [];
  }
};

// 3️⃣ Get pending reviews (admin)
export const getPendingReviews = async () => {
  try {
    const response = await axios.get(`${UrlBackend}/review/admin`, {
      withCredentials: true,
    });
    return response.data.reviews || [];
  } catch (error) {
    console.error("Get Pending Reviews Error:", error.response?.data || error.message);
    return [];
  }
};

// 4️⃣ Approve review (admin)
export const approveReview = async (reviewId) => {
  try {
    const response = await axios.patch(
      `${UrlBackend}/review/admin/${reviewId}/approve`,
      {},
      { withCredentials: true }
    );
    // console.log("Review approved:", response.data);
    return response.data;
  } catch (error) {
    console.error("Approve Review Error:", error.response?.data || error.message);
    throw error;
  }
};

// 5️⃣ Reject review (admin)
export const rejectReview = async (reviewId) => {
  try {
    const response = await axios.patch(
      `${UrlBackend}/review/admin/${reviewId}/reject`,
      {},
      { withCredentials: true }
    );
    // console.log("Review rejected:", response.data);
    return response.data;
  } catch (error) {
    console.error("Reject Review Error:", error.response?.data || error.message);
    throw error;
  }
};

// 7️⃣ Delete review (user – own review / admin)
export const deleteReview = async (reviewId) => {
  try {
    const response = await axios.delete(
      `${UrlBackend}/review/${reviewId}`,
      {
        withCredentials: true,
      }
    );
    // console.log("Review deleted:", response.data);
    return response.data;
  } catch (error) {
    console.error("Delete Review Error:", error.response?.data || error.message);
    throw error;
  }
};
