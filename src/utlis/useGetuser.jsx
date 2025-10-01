"use client";

import { useEffect, useState } from "react";
import { getUserProfile } from "../hook/useAuth";
import { useDispatch } from "react-redux";
import { userget } from "../redux/userSlice";


// ✅ Custom hook
export const useGetUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const data = await getUserProfile();
        setUser(data.user);
        dispatch(userget(data.user)); 
        console.log(data.user);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);
  return { user, loading, error };
};