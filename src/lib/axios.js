import axios from "axios";
import { UrlBackend } from "../confic/urlExport";
import { getCsrfHeaders } from "./csrf";
import { secureStorage } from "./secureStorage";

const apiClient = axios.create({
  baseURL: UrlBackend,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const isHttps = window.location.protocol === "https:";
      const isLocalhost = config.baseURL && config.baseURL.includes("localhost");
      if (isHttps && config.baseURL && config.baseURL.startsWith("http://") && !isLocalhost) {
        config.baseURL = config.baseURL.replace("http://", "https://");
      }
    }

    if (["post", "put", "patch", "delete"].includes(config.method)) {
      const csrfHeaders = getCsrfHeaders();
      config.headers = { ...config.headers, ...csrfHeaders };
    }

    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;

      if (status === 401 || status === 403) {
        if (typeof window !== "undefined") {
          secureStorage.removeItem("user");
          if (window.location.pathname !== "/signin" && window.location.pathname !== "/signup") {
            window.location.href = "/signin";
          }
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
