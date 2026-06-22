import apiClient from "../lib/axios";

// sockeet io product update
export const CreateNotification = async (formData) => {
  try {
    const response = await apiClient.post(
      `/notification`,
      formData,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    console.error("update error:", error.response?.data || error.message);
    throw error;
  }
};



// all notification get 
export const NotificationAllGet = async () => {
  try {
    const response = await apiClient.get(`/notification`,{
      withCredentials: true,
    });
    return response.data; 
  } catch (error) {
    console.error("Registration error:", error.response?.data || error.message);
    throw error; 
  }
};


//  mark single read
export const NotificationSingleRead = async (id) => {
  try {
    const response = await apiClient.put(`/notification/${id}/read`, {}, {
      withCredentials: true,
    });
    return response.data; 
  } catch (error) {
    console.error("Registration error:", error.response?.data || error.message);
    throw error; 
  }
};

// mark-all-read
export const NotificationAllRead = async () => {
  try {
    const response = await apiClient.put(`/notification/mark-all-read`, {}, {
      withCredentials: true,
    });
    return response.data; 
  } catch (error) {
    console.error("Registration error:", error.response?.data || error.message);
    throw error; 
  }
};

// delete
export const NotificationDelete = async (id) => {
  try {
    const response = await apiClient.delete(`/notification/${id}`,{
      withCredentials: true,
    });
    return response.data; 
  } catch (error) {
    console.error("Registration error:", error.response?.data || error.message);
    throw error; 
  }
};
