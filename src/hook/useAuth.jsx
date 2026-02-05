
import axios from "axios";
import { UrlBackend } from "../confic/urlExport";
import { userget } from "../redux/userSlice";
// signup
export const UseAuth = async (formData, route) => {
  try {
    const response = await axios.post(`${UrlBackend}/users/signup`, formData, { withCredentials: true });

    if (response.data.success) {
      route.push("/signin");
    }

    return response.data;
  } catch (error) {
    console.error("Registration error:", error.response?.data || error.message);
    throw error;
  }
};

// signin
export const UserSignin = async (formData, route, dispatch) => {
  try {
    const response = await axios.post(`${UrlBackend}/users/signin`, formData, {
      withCredentials: true,
    });

    if (response.data.success) {
      dispatch(userget(response.data));
      route.push("/");
    }

    return response.data;
  } catch (error) {
    console.error("Registration error:", error.response?.data || error.message);
    throw error;
  }
};

// logout 
export const Logout = async (route) => {
  try {
    const response = await axios.get(`${UrlBackend}/users/signout`, {
      withCredentials: true,
    });
    if (response.data.success) {
      route.push("/signin");
    }
    return response.data;
  } catch (error) {
    console.error("Registration error:", error.response?.data || error.message);
    throw error;
  }
}

// reset password
export const sendOtp = async (formData) => {
  try {
    const response = await axios.post(`${UrlBackend}/users/send-otp`, formData, { withCredentials: true });
    return response.data;

  } catch (error) {
    console.error("Reset Password error:", error.response?.data || error.message);
    throw error;
  }
}
// VERIFY OTP
export const verifyOtp = async (formData) => {
  try {
    const response = await axios.post(`${UrlBackend}/users/verify-otp`, formData, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("Verify OTP error:", error.response?.data || error.message);
    throw error;
  }
}

// CHANGE PASSWORD
export const changePassword = async (formData) => {
  try {
    const response = await axios.post(`${UrlBackend}/users/reset-password`, formData, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("Change Password error:", error.response?.data || error.message);
    throw error;
  }
}

// google sign in
export const googleSignIn = async (formData, route, dispatch) => {
  try {
    const response = await axios.post(`${UrlBackend}/users/google-auth`, formData, {
      withCredentials: true,
    });
    if (response.data.success) {
      dispatch(userget(response.data));
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
    // console.error("Get User Profile error:", error.response?.data || error.message);
    throw error;
  }
}

// get all users
export const getAllUser = async () => {
  try {
    const response = await axios.get(`${UrlBackend}/users/getallusers`, {
      withCredentials: true,
    });
    return response.data;
  }
  catch (error) {
    console.error("Get All User error:", error.response?.data || error.message);
    throw error;
  }
}

// update profile
export const updateUserProfile = async (id, formData) => {
  try {
    const response = await axios.put(`${UrlBackend}/users/userupdate/${id}`, formData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Update User Profile error:", error.response?.data || error.message);
    throw error;
  }
}

// get addresses
export const getAddress = async () => {
  try {
    const response = await axios.get(`${UrlBackend}/address/get`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Get Address error:", error.response?.data || error.message);
    throw error;
  }
}

// create address
export const createAddress = async (addressData) => {
  try {
    const response = await axios.post(`${UrlBackend}/address/create`, addressData, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Create Address error:", error.response?.data || error.message);
    throw error;
  }
}

// update address
export const updateAddress = async (addressData) => {
  try {
    const response = await axios.put(`${UrlBackend}/address/update`, addressData, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Update Address error:", error.response?.data || error.message);
    throw error;
  }
}

// delete user
export const deleteUser = async (id) => {
  try {
    const response = await axios.delete(`${UrlBackend}/users/userdelete/${id}`, {
      withCredentials: true,
    });
    return response.data;
  }
  catch (error) {
    console.error("Delete User error:", error.response?.data || error.message);
    throw error;
  }
}