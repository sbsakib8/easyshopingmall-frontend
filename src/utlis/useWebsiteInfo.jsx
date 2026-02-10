"use client";
import { useCallback, useEffect, useState } from "react";
import { UrlBackend } from "../confic/urlExport";

export const useWebsiteInfo = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchInfo = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch(`${UrlBackend}/websiteinfo/get`, {
                cache: 'no-store'
            });
            const result = await res.json();
            const info = result?.data?.[0] ?? null;
            setData(info);
            setError(null);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchInfo();
    }, [fetchInfo]);

    return { data, loading, error, refetch: fetchInfo };
};

export default useWebsiteInfo;
