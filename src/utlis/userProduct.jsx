"use client";
import { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { ProductAllGet } from "../hook/useProduct";

// ✅ Custom hook
export const useGetProduct = (formData) => {
  const [product, setProduct] = useState(null);
  const [totalCount, setTotalCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const fetchProduct = useCallback(async () => {
    if (!formData) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await ProductAllGet(formData);
      setProduct(data?.data);
      setTotalCount(data?.totalCount)
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [formData]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return { product, totalCount, loading, error, refetch: fetchProduct };
};
