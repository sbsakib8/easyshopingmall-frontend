"use client";
import { useEffect, useState, useCallback } from "react";
import { WebsiteinfoAllGet } from "@/src/hook/content/useWebsiteInfo";

//  Custom hook
export const useGetwebsiteinfo = () => {
  const [websiteinfo, setWebsiteinfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWebsiteinfo = useCallback(async () => {
    try {
      setLoading(true);
      const data = await WebsiteinfoAllGet();
      setWebsiteinfo(data.data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWebsiteinfo();
  }, [fetchWebsiteinfo]);

  return { websiteinfo, loading, error, refetch: fetchWebsiteinfo };
};
