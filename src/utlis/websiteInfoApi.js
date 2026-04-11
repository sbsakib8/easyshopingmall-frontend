
import { UrlBackend } from "../confic/urlExport";

export const getWebsiteInfoApi = async () => {
    try {
        const res = await fetch(`${UrlBackend}/websiteinfo/get`, {
            next: { revalidate: 3600 } // Cache for 1 hour
        });
        const result = await res.json();
        return result?.data?.[0] ?? null;
    } catch (err) {
        console.error("Error fetching website info:", err);
        return null;
    }
};
