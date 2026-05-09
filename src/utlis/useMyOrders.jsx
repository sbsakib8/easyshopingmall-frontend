"use client";
import { useEffect, useState, useCallback } from "react";
import { OrderAllGet } from "./useOrder";

export const useMyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMyOrders = useCallback(async () => {
    try {
      setLoading(true);
      const data = await OrderAllGet();
      setOrders(data?.data || []);
      setError(null);
    } catch (err) {
      setError(err);
      console.error("Fetch my orders error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyOrders();
  }, [fetchMyOrders]);

  return { orders, loading, error, refetch: fetchMyOrders };
};
