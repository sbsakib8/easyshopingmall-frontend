"use client";
import { useEffect, useState, useCallback } from "react";
import { NotificationAllGet } from "../hook/useNotification";

// ✅ Custom hook
export const useGetnotification = () => {
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotification = useCallback(async () => {
    try {
      setLoading(true);
      const data = await NotificationAllGet();
      setNotification(data.data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotification();
  }, [fetchNotification]);

  return { notification, loading, error, refetch: fetchNotification };
};
