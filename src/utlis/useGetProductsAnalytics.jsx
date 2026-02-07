"use client";
import { useEffect, useState, useCallback } from "react";
import { getProductsAnalytics } from "../hook/useProductsAnalytices";

// ✅ Custom hook
export const useGetProductsAnalytics = () => {
  const [salesData, setSalesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGetallUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getProductsAnalytics();
      setSalesData(data.salesData);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGetallUsers();
  }, [fetchGetallUsers]);

  return { salesData, loading, error, refetch: fetchGetallUsers };
};
