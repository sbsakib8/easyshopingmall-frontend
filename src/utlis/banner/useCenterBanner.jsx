"use client";
import { CenterBannerAllGet } from "@/src/hook/useCernterBanner";
import { useCallback, useEffect, useState } from "react";

export const useGetCenterBanner = () => {
  const [ads, setAds] = useState([]); // ✅ ALWAYS ARRAY
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAds = useCallback(async () => {
    try {
      setLoading(true);
      const res = await CenterBannerAllGet();

      // ✅ SAFEST EXTRACTION
      const list = Array.isArray(res?.data) ? res.data : [];
      setAds(list);
      setError(null);
    } catch (err) {
      console.error("CenterBanner fetch error", err);
      setAds([]);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAds();
  }, [fetchAds]);

  return { ads, loading, error };
};
