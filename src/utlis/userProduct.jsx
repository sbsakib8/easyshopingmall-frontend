"use client";
import { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { ProductAllGet } from "../hook/useProduct";

// ✅ Custom hook
export const useGetProduct = (formData) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  // ✅ useEffect এর বাইরে fetch function রাখো
  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      const data = await ProductAllGet(formData);
      setProduct(data.data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [formData]);

  // ✅ useEffect এর ভিতরে শুধু call করো
  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  // ✅ এখন আমরা refetch হিসেবে return করতে পারি
  return { product, loading, error, refetch: fetchProduct };
};
