import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getWishlistApi } from "../hook/useWishlist";

export const useWishlist = () => {
    const dispatch = useDispatch();
    const { data: wishlist, loading, error } = useSelector((state) => state.wishlist);

    useEffect(() => {
        getWishlistApi(dispatch);
    }, [dispatch]);

    return { wishlist, loading, error };
};
