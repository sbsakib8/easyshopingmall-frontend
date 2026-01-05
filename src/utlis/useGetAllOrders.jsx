"use client";
import { useEffect, useState, useCallback } from "react";
import { OrderAllGetAdmin } from "./useOrder";

// ✅ Custom hook
export const useGetAllOrders = () => {
  const [allOrders, setAllOrders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGetAllOrders = useCallback(async () => {
    try {
      setLoading(true);
      const data = await OrderAllGetAdmin();
      setAllOrders(data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGetAllOrders();
  }, [fetchGetAllOrders]);

  return { allOrders, loading, error, refetch: fetchGetAllOrders };
};
