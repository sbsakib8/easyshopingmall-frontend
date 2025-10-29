"use client";
import { useEffect, useState, useCallback } from "react";
import { ContactGet } from "@/src/hook/content/useContact";

// ✅ Custom hook
export const useGetEmail = () => {
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEmail = useCallback(async () => {
    try {
      setLoading(true);
      const data = await ContactGet();
      setEmail(data.data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmail();
  }, [fetchEmail]);

  return { email, loading, error, refetch: fetchEmail };
};
