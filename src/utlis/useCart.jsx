"use client";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCartApi } from "../hook/useCart";

// Simple hook that returns redux cart and provides a refetch helper
export const useGetCart = () => {
    const dispatch = useDispatch();
    const cartState = useSelector((state) => state.cart || { items: [], loading: false, error: null });
    const user = useSelector((state) => state.user.data);

    const refetch = useCallback(() => {
        if (user?._id) {
            return getCartApi(user._id, dispatch);
        }
        return Promise.resolve();
    }, [user, dispatch]);

    useEffect(() => {
        if (user?._id) getCartApi(user._id, dispatch);
    }, [user, dispatch]);

    return { cart: cartState.items || [], loading: cartState.loading, error: cartState.error, refetch };
};
