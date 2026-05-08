"use client";
import { useEffect, useState, useCallback } from "react";
import { getUserProfile } from "../hook/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { userget } from "../redux/userSlice";

// ✅ Custom hook
export const useGetUser = () => {
  const reduxUser = useSelector((state) => state.user.data);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const resData = await getUserProfile();
      
      const userData = resData?.user || resData?.data || (resData?._id || resData?.id ? resData : null);
      
      if (userData) {
        if (resData?.referrals) {
          userData.referrals = resData.referrals;
        }
        localStorage.setItem("user", JSON.stringify(userData));
        dispatch(userget(userData));
      } else {
        localStorage.removeItem("user");
        dispatch(userget(null));
      }
    } catch (err) {
      setError(err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("user");
        dispatch(userget(null));
      }
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    // Initial fetch from localStorage if Redux is empty
    if (!reduxUser) {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try {
          dispatch(userget(JSON.parse(savedUser)));
        } catch (e) {
          localStorage.removeItem("user");
        }
      }
    }
    fetchUser();
  }, [fetchUser]); // Removed reduxUser from deps to avoid infinite loop if fetchUser dispatches

  return { user: reduxUser, loading, error, refetch: fetchUser };
};