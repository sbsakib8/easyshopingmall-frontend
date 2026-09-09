"use client";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { SubCategoryAllGet } from "../hook/useSubcategory";

// ✅ Custom hook
export const useGetSubcategory = (filterType, status = "active") => {
  const [subcategory, setSubcategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const data = await SubCategoryAllGet(dispatch, filterType, status);
        const activeSubcategories = (data?.data || []).filter(
          (sub) => status === "all" || sub.isActive !== false
        );
        setSubcategory(activeSubcategories);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [filterType, status]);
  return { subcategory, loading, error };
};