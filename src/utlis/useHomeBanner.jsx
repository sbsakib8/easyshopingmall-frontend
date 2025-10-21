"use client";
import { useEffect, useState, useCallback } from "react";
import { HomeBannerAllGet } from "../hook/useHomeBanner";

// ✅ Custom hook
export const useGetHomeBanner = () => {
  const [homebanner, setHomeBanner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHomebanner = useCallback(async () => {
    try {
      setLoading(true);
      const data = await HomeBannerAllGet();
      setHomeBanner(data.data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHomebanner();
  }, [fetchHomebanner]);

  return { homebanner, loading, error, refetch: fetchHomebanner };
};
