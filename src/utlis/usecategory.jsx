"use client";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { CategoryAllGet } from "../hook/usecategory";

// ✅ Custom hook
export const useGetcategory = () => {
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const data = await CategoryAllGet(dispatch);
        setCategory(data.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);
  return { category, loading, error };
};