"use client";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ProductAllGet } from "../hook/useProduct";

// ✅ Custom hook
export const useGetProduct = (formData) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchproduct = async () => {
      try {
        setLoading(true);
        const data = await ProductAllGet(formData);
        setProduct(data.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchproduct();
  }, []);
  return { product, loading, error };
};