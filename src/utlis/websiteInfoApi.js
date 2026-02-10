
import { UrlBackend } from "../confic/urlExport";

export const getWebsiteInfoApi = async () => {
    try {
        const res = await fetch(`${UrlBackend}/websiteinfo/get`, {
            cache: 'no-store'
        });
        const result = await res.json();
        return result?.data?.[0] ?? null;
    } catch (err) {
        console.error("Error fetching website info:", err);
        return null;
    }
};
