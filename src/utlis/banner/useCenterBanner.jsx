"use client";
import { useEffect, useState, useCallback } from "react";
import { CenterBannerAllGet } from "@/src/hook/useCernterBanner";

// ✅ Custom hook
export const useGetCenterBanner = () => {
  const [centerbanner, setCenterBanner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCenterBanner = useCallback(async () => {
    try {
      setLoading(true);
      const data = await CenterBannerAllGet();
      setCenterBanner(data.data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCenterBanner();
  }, [fetchCenterBanner]);

  return { centerbanner, loading, error, refetch: fetchCenterBanner };
};
