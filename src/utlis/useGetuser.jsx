"use client";
import { useEffect, useState, useCallback } from "react";
import { getUserProfile } from "../hook/useAuth";
import { getMyDropshippingAnalytics } from "../hook/useDropshippingAnalytics";
import { useDispatch, useSelector } from "react-redux";
import { userget } from "../redux/userSlice";
import { secureStorage } from "../lib/secureStorage";

// Custom hook
export const useGetUser = () => {
  const reduxUser = useSelector((state) => state.user.data);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const resData = await getUserProfile();

      let userData = resData?.user || resData?.data || (resData?._id || resData?.id ? resData : null);

      if (userData) {
        if (resData?.referrals) {
          userData.referrals = resData.referrals;
        }

        if (userData.role === "DROPSHIPPING" || userData.roles?.includes("DROPSHIPPING")) {
          try {
            const analyticsRes = await getMyDropshippingAnalytics();
            if (analyticsRes.success && analyticsRes.data?.videoReferrals) {
              const videoBonusApproved = analyticsRes.data.videoReferrals.reduce((sum, ref) => {
                return sum + (ref.status === 'approved' ? (ref.bonusAmount || 0) : 0);
              }, 0);

              userData = {
                ...userData,
                videoBonusApproved
              };
            }
          } catch (analyticsErr) {
            console.error("Error fetching analytics in useGetUser:", analyticsErr);
          }
        }

        secureStorage.setItem("user", userData);
        dispatch(userget(userData));
      } else {
        secureStorage.removeItem("user");
        dispatch(userget(null));
      }
    } catch (err) {
      setError(err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        secureStorage.removeItem("user");
        dispatch(userget(null));
      }
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    if (!reduxUser) {
      const savedUser = secureStorage.getItem("user");
      if (savedUser) {
        try {
          dispatch(userget(savedUser));
        } catch {
          secureStorage.removeItem("user");
        }
      }
    }
    fetchUser();
  }, [fetchUser]);

  return { user: reduxUser, loading, error, refetch: fetchUser };
};
