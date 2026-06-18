
import apiClient from "../lib/axios";
import { sanitizeObject, sanitizeEmail } from "../lib/sanitize";
import { encryptPayload } from "../lib/encryption";
import { secureStorage } from "../lib/secureStorage";
import { userget, clearUser } from "../redux/userSlice";

// signup
export const UseAuth = async (formData, route) => {
  try {
    const sanitized = sanitizeObject(formData);
    const payload = encryptPayload(sanitized, ["password"]);
    const response = await apiClient.post("/users/signup", payload);

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
    const sanitized = { ...formData, email: sanitizeEmail(formData.email) };
    const payload = encryptPayload(sanitized, ["password"]);
    const response = await apiClient.post("/users/signin", payload);

    if (response.data.success) {
      const userData = response.data.user;
      dispatch(userget(userData));
      secureStorage.setItem("user", userData);
      route.push("/");
    }

    return response.data;
  } catch (error) {
    console.error("Signin error:", error.response?.data || error.message);
    throw error;
  }
};

// logout
export const Logout = async (route, dispatch) => {
  try {
    const response = await apiClient.get("/users/signout");
    if (response.data.success) {
      secureStorage.removeItem("user");
      if (dispatch) {
        dispatch(clearUser());
      }
      route.push("/signin");
    }
    return response.data;
  } catch (error) {
    console.error("Signout error:", error.response?.data || error.message);
    throw error;
  }
}

// send OTP for password reset
export const sendOtp = async (formData) => {
  try {
    const sanitized = sanitizeObject(formData);
    const response = await apiClient.post("/users/send-otp", sanitized);
    return response.data;
  } catch (error) {
    console.error("Reset Password error:", error.response?.data || error.message);
    throw error;
  }
};

// verify OTP
export const verifyOtp = async (formData) => {
  try {
    const sanitized = sanitizeObject(formData);
    const response = await apiClient.post("/users/verify-otp", sanitized);
    return response.data;
  } catch (error) {
    console.error("Verify OTP error:", error.response?.data || error.message);
    throw error;
  }
};

// change/reset password
export const changePassword = async (formData) => {
  try {
    const sanitized = sanitizeObject(formData);
    const payload = encryptPayload(sanitized, ["password", "newpassword"]);
    const response = await apiClient.post("/users/reset-password", payload);
    return response.data;
  } catch (error) {
    console.error("Change Password error:", error.response?.data || error.message);
    throw error;
  }
};

// google sign in
export const googleSignIn = async (formData, route, dispatch) => {
  try {
    const sanitized = sanitizeObject(formData);
    const response = await apiClient.post("/users/google-auth", sanitized);
    if (response.data.success) {
      const { success, message, id, ...rest } = response.data;
      const userData = { ...rest, _id: id, id };
      dispatch(userget(userData));
      secureStorage.setItem("user", userData);
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
    const response = await apiClient.get("/users/userprofile");
    return response.data;
  } catch (error) {
    throw error;
  }
}

// get all users
export const getAllUser = async () => {
  try {
    const response = await apiClient.get("/users/getallusers");
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
    const sanitized = sanitizeObject(formData);
    const response = await apiClient.put(`/users/userupdate/${id}`, sanitized);
    return response.data;
  } catch (error) {
    console.error("Update User Profile error:", error.response?.data || error.message);
    throw error;
  }
}

// get addresses
export const getAddress = async () => {
  try {
    const response = await apiClient.get("/address/get");
    return response.data;
  } catch (error) {
    console.error("Get Address error:", error.response?.data || error.message);
    throw error;
  }
}

// create address
export const createAddress = async (addressData) => {
  try {
    const sanitized = sanitizeObject(addressData);
    const response = await apiClient.post("/address/create", sanitized);
    return response.data;
  } catch (error) {
    console.error("Create Address error:", error.response?.data || error.message);
    throw error;
  }
}

// update address
export const updateAddress = async (addressData) => {
  try {
    const sanitized = sanitizeObject(addressData);
    const response = await apiClient.put("/address/update", sanitized);
    return response.data;
  } catch (error) {
    console.error("Update Address error:", error.response?.data || error.message);
    throw error;
  }
}

// delete address (soft delete)
export const deleteAddress = async (addressId) => {
  try {
    const response = await apiClient.delete("/address/disable", {
      data: { _id: addressId },
    });
    return response.data;
  } catch (error) {
    console.error("Delete Address error:", error.response?.data || error.message);
    throw error;
  }
}


// delete user
export const deleteUser = async (id) => {
  try {
    const response = await apiClient.delete(`/users/userdelete/${id}`);
    return response.data;
  }
  catch (error) {
    console.error("Delete User error:", error.response?.data || error.message);
    throw error;
  }
}

// upload user image or shop logo
export const uploadUserImage = async (id, file, type = 'profile') => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const url = type === 'shopLogo'
      ? `/users/user-image/${id}?type=shopLogo`
      : `/users/user-image/${id}`;

    const response = await apiClient.put(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Upload Image error:", error.response?.data || error.message);
    throw error;
  }
}
