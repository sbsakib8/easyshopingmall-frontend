"use client";
import { useEffect, useState, useCallback } from "react";
import apiClient from "@/src/lib/axios";

export const useDashboardStats = (params = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      if (params?.startDate) query.set("startDate", params.startDate);
      if (params?.endDate) query.set("endDate", params.endDate);
      const qs = query.toString();
      const url = `/analytics/dashboard/summary${qs ? `?${qs}` : ""}`;
      const res = await apiClient.get(url);
      setData(res.data?.data || null);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [params?.startDate, params?.endDate]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { data, loading, error, refetch: fetchStats };
};
