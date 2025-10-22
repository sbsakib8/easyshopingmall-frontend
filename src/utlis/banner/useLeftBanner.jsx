"use client";
import { useEffect, useState, useCallback } from "react";
import { LeftBannerAllGet } from "@/src/hook/useLeftBanner";

// ✅ Custom hook
export const useGetLeftBanner = () => {
  const [leftbanner, setLeftBanner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLeftBanner = useCallback(async () => {
    try {
      setLoading(true);
      const data = await LeftBannerAllGet();
      setLeftBanner(data.data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeftBanner();
  }, [fetchLeftBanner]);

  return { leftbanner, loading, error, refetch: fetchLeftBanner };
};
