"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { ProductAllGet } from "../hook/useProduct";
import { normalizeProduct } from "./filterHelpers";

/**
 * Custom hook for server-side product filtering with debouncing
 * @param {Object} filters - Filter parameters
 * @param {string} filters.search - Search term
 * @param {string} filters.categoryId - Category ID
 * @param {string} filters.subCategoryId - Subcategory ID
 * @param {number} filters.minPrice - Minimum price
 * @param {number} filters.maxPrice - Maximum price
 * @param {string} filters.sortBy - Sort option
 * @param {number} filters.page - Page number
 * @param {number} filters.limit - Items per page
 * @param {number} filters.debounceMs - Debounce delay in milliseconds (default: 300)
 */
export const useFilteredProducts = (filters = {}) => {
    const [products, setProducts] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Ref to track the debounce timer
    const debounceTimerRef = useRef(null);

    // Ref to track if component is mounted
    const isMountedRef = useRef(true);

    const {
        search = "",
        categoryId = "all",
        subCategoryId = "all",
        minPrice = 0,
        maxPrice = 100000,
        sortBy = "name",
        page = 1,
        limit = 30,
        debounceMs = 300,
        brand = "all",
        rating = 0,
        gender = "all"
    } = filters;

    const fetchProducts = useCallback(async (params) => {
        if (!isMountedRef.current) return;

        try {
            setLoading(true);
            setError(null);

            // Build request params
            const requestParams = {
                page: params.page,
                limit: params.limit,
                sortBy: params.sortBy,
            };

            // Add optional filters only if they're not default values
            if (params.search && params.search.trim()) {
                requestParams.search = params.search.trim();
            }

            if (params.categoryId && params.categoryId !== "all") {
                requestParams.categoryId = params.categoryId;
            }

            if (params.subCategoryId && params.subCategoryId !== "all") {
                requestParams.subCategoryId = params.subCategoryId;
            }

            if (params.minPrice > 0) {
                requestParams.minPrice = params.minPrice;
            }

            if (params.maxPrice < 100000) {
                requestParams.maxPrice = params.maxPrice;
            }

            if (params.brand && params.brand !== "all") {
                requestParams.brand = params.brand;
            }

            if (params.rating > 0) {
                requestParams.rating = params.rating;
            }

            if (params.gender && params.gender !== "all") {
                requestParams.gender = params.gender;
            }


            const data = await ProductAllGet(requestParams);

            if (!isMountedRef.current) return;

            // Handle various possible response structures
            const rawProducts = data?.data || data?.products || (Array.isArray(data) ? data : []);
            const productsList = rawProducts.map(normalizeProduct);
            const count = data?.totalCount || data?.total || (Array.isArray(data) ? data.length : 0);

            setProducts(productsList);
            setTotalCount(count);
        } catch (err) {
            if (!isMountedRef.current) return;
            console.error("Error fetching filtered products:", err);
            setError(err);
            setProducts([]);
            setTotalCount(0);
        } finally {
            setLoading(false);
        }
    }, []);

    // Debounced fetch effect
    useEffect(() => {
        // Clear any existing timer
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }



        // Create debounced fetch
        debounceTimerRef.current = setTimeout(() => {
            fetchProducts({
                search,
                categoryId,
                subCategoryId,
                minPrice,
                maxPrice,
                sortBy,
                page,
                limit,
                brand,
                rating,
                gender
            });
        }, debounceMs);

        // Cleanup
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [
        search,
        categoryId,
        subCategoryId,
        minPrice,
        maxPrice,
        sortBy,
        page,
        limit,
        brand,
        rating,
        gender,
        debounceMs,
        fetchProducts
    ]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    const refetch = useCallback(() => {
        fetchProducts({
            search,
            categoryId,
            subCategoryId,
            minPrice,
            maxPrice,
            sortBy,
            page,
            limit,
            brand,
            rating,
            gender
        });
    }, [search, categoryId, subCategoryId, minPrice, maxPrice, sortBy, page, limit, brand, rating, gender, fetchProducts]);

    return {
        products,
        totalCount,
        loading,
        error,
        refetch
    };
};
