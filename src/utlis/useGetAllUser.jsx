"use client";
import { useEffect, useState, useCallback } from "react";
import { getAllUser } from "../hook/useAuth";

// ✅ Custom hook
export const useGetallUsers = () => {
  const [allusers, setusers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGetallUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllUser();
      setusers(data.users);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGetallUsers();
  }, [fetchGetallUsers]);

  return { allusers, loading, error, refetch: fetchGetallUsers };
};
