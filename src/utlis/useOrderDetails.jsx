"use client";
import { useEffect, useState, useCallback } from "react";
import { OrderGetDetails } from "./useOrder";

export const useOrderDetails = (orderId) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrderDetails = useCallback(async () => {
    if (!orderId) return;
    try {
      setLoading(true);
      const data = await OrderGetDetails(orderId);
      setOrder(data?.data || null);
      setError(null);
    } catch (err) {
      setError(err);
      console.error("Fetch order details error:", err);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrderDetails();
  }, [fetchOrderDetails]);

  return { order, loading, error, refetch: fetchOrderDetails };
};
