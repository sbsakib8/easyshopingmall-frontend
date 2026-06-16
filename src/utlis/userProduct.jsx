"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch } from "react-redux";
import { ProductAllGet } from "../hook/useProduct";

export const useGetProduct = (formData) => {
  const [product, setProduct] = useState(null);
  const [totalCount, setTotalCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const prevFormDataRef = useRef(null);

  const fetchProduct = useCallback(async () => {
    if (!formData) {
      setLoading(false);
      return;
    }

    const serialized = JSON.stringify(formData);
    if (prevFormDataRef.current === serialized) {
      return;
    }
    prevFormDataRef.current = serialized;

    try {
      setLoading(true);
      const data = await ProductAllGet(formData);
      setProduct(data?.data);
      setTotalCount(data?.totalCount);
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
