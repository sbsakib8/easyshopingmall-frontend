"use client";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { UrlBackend } from "../confic/urlExport";

export const useWebsiteInfo = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchInfo = useCallback(async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${UrlBackend}/websiteinfo/get`, { withCredentials: true });
            const info = res.data?.data?.[0] ?? null;
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
