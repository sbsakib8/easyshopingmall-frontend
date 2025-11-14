"use client";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { OrderCreate } from "../hook/useOrder";

// ✅ Custom hook
export const useGetCart = (formData) => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();

    const fetchCart = useCallback(async () => {
        try {
            setLoading(true);
            const data = await OrderCreate(formData);
            setProduct(data.data);
            setError(null);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [formData]);

    useEffect(() => {
        fetchProduct();
    }, [fetchOrder]);

    return { cart, loading, error, refetch: fetchCart };
};
