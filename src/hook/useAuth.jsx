import axios from "axios";
import { UrlBackend } from "../confic/urlExport";

export const UseAuth = async (formData, route) => {
  try {
    const response = await axios.post(`${UrlBackend}/users/signup`, formData );

    if (response.data.success) {
      route.push("/signin");
    }

    return response.data; 
  } catch (error) {
    console.error("Registration error:", error.response?.data || error.message);
    throw error; 
  }
};

export const UserSignin = async (formData, route) => {
  try {
    const response = await axios.post(`${UrlBackend}/users/signin`, formData, {
      withCredentials: true,
    });

    if (response.data.success) {
      route.push("/");
    }

    return response.data; 
  } catch (error) {
    console.error("Registration error:", error.response?.data || error.message);
    throw error; 
  }
};

export const UserGet = async (id ) => {
  try {
    const response = await axios.get(`${UrlBackend}/users/${id}`);
    return response.data; 
  } catch (error) {
    console.error("Registration error:", error.response?.data || error.message);
    throw error; 
  }
};

// reset password
export const sendOtp = async (formData) => {
  try {
    const response = await axios.post(`${UrlBackend}/users/send-otp`, formData);
    return response.data;

  } catch (error) {
    console.error("Reset Password error:", error.response?.data || error.message);
    throw error;
  }
}
// VERIFY OTP
export const verifyOtp = async (formData) => {
  try {
    const response = await axios.post(`${UrlBackend}/users/verify-otp`, formData);
    return response.data;
  } catch (error) {
    console.error("Verify OTP error:", error.response?.data || error.message);
    throw error;
  }
}

// CHANGE PASSWORD
export const changePassword = async (formData) => {
  try {
    const response = await axios.post(`${UrlBackend}/users/reset-password`, formData);
    return response.data;
  } catch (error) {
    console.error("Change Password error:", error.response?.data || error.message);
    throw error;
  }
}

// google sign in
export const googleSignIn = async (formData, route) => {
  try {
     const response = await axios.post(`${UrlBackend}/users/google-auth`, formData, {
      withCredentials: true,
    });
    if (response.data.success) {
      route.push("/");
    }
    return response.data;

  } catch (error) {
    console.error("Google Sign-In error:", error.response?.data || error.message);
    throw error;
  }
}

// usergetprofile
export const getUserProfile = async () => {
  try {
    const response = await axios.get(`${UrlBackend}/users/userprofile`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Get User Profile error:", error.response?.data || error.message);
    throw error;
  }
}