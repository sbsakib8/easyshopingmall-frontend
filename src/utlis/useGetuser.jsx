"use client";
import { useEffect, useState } from "react";
import { getUserProfile } from "../hook/useAuth";
import { useDispatch } from "react-redux";
import { userget } from "../redux/userSlice";

// ✅ Custom hook
export const useGetUser = () => {
  const [user, setUser] = useState(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    }
    return null;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const resData = await getUserProfile();
        
        // Comprehensive check for user data in the response
        const userData = resData?.user || resData?.data || (resData?._id || resData?.id ? resData : null);
        
        if (userData) {
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
          dispatch(userget(userData)); // Sync to Redux immediately
        } else {
          // Only clear if the backend explicitly says there's no user
          setUser(null);
          localStorage.removeItem("user");
          dispatch(userget(null));
        }
      } catch (err) {
        setError(err);
        // Only clear session on 401 Unauthorized or 403 Forbidden
        if (err.response?.status === 401 || err.response?.status === 403) {
          setUser(null);
          localStorage.removeItem("user");
          dispatch(userget(null));
        }
        // If it's a network error (500, etc.), we KEEP the local user 
        // to prevent logging the user out just because the server is down.
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);
  return { user, loading, error };
};