"use client";

import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { UrlBackend } from "../confic/urlExport";

export const useSearchProduct = ({ search = "", page = 1, limit = 100 } = {}) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const controllerRef = useRef(null); // Cancel previous request

    const fetchSearch = useCallback(async ({ search, page, limit }) => {
        if (!search || search.trim() === "") {
            setData(null);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // Cancel previous request
            if (controllerRef.current) {
                controllerRef.current.abort();
            }
            controllerRef.current = new AbortController();

            const res = await axios.post(
                `${UrlBackend}/products/search-product`,
                { search, page, limit },
                {
                    withCredentials: true,
                    signal: controllerRef.current.signal,
                    headers: { "Content-Type": "application/json" },
                }
            );

            setData(res.data);
        } catch (err) {
            if (axios.isCancel(err)) return; // Ignore cancelled requests
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Auto-fetch when search changes
    useEffect(() => {
        if (!search || search.trim() === "") {
            setData(null);
            return;
        }

        const timeout = setTimeout(() => {
            fetchSearch({ search, page, limit });
        }, 400); // Debounce typing

        return () => clearTimeout(timeout);
    }, [search, page, limit, fetchSearch]);

    return {
        data,
        loading,
        error,

        // Allows manual refetch: refetch({ search, page, limit })
        refetch: (opts = {}) =>
            fetchSearch({
                search: opts.search ?? search,
                page: opts.page ?? page,
                limit: opts.limit ?? limit,
            }),
    };
};
