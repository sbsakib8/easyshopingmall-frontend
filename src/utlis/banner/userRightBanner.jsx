"use client";
import { useEffect, useState, useCallback } from "react";
import { RightBannerAllGet } from "@/src/hook/userRightBanner";

// ✅ Custom hook
export const useGetRightBanner = () => {
  const [rightbanner, setRightBanner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRightBanner = useCallback(async () => {
    try {
      setLoading(true);
      const data = await RightBannerAllGet();
      setRightBanner(data.data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRightBanner();
  }, [fetchRightBanner]);

  return { rightbanner, loading, error, refetch: fetchRightBanner };
};
