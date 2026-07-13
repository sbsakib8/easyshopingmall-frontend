import { useState, useEffect } from "react";
import apiClient from "../lib/axios";

/**
 * Fetch active notices (public - for dropshipping user overview)
 */
export const useActiveNotices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/notice/active`, {
        withCredentials: true,
      });
      setNotices(response.data.data || []);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch notices:", err);
      setError(err.response?.data?.message || "Failed to fetch notices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  return { notices, loading, error, refetch: fetchNotices };
};

/**
 * Fetch all notices (admin only - includes inactive)
 */
export const useAllNotices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/notice/admin/all`, {
        withCredentials: true,
      });
      setNotices(response.data.data || []);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch notices:", err);
      setError(err.response?.data?.message || "Failed to fetch notices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  return { notices, loading, error, refetch: fetchNotices };
};

/**
 * Create a new notice (admin only)
 */
export const createNotice = async (noticeData) => {
  try {
    const response = await apiClient.post(`/notice`, noticeData, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Create notice error:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Update a notice (admin only)
 */
export const updateNotice = async (noticeId, noticeData) => {
  try {
    const response = await apiClient.put(`/notice/${noticeId}`, noticeData, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Update notice error:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Delete a notice (admin only)
 */
export const deleteNotice = async (noticeId) => {
  try {
    const response = await apiClient.delete(`/notice/${noticeId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Delete notice error:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Toggle notice active status (admin only)
 */
export const toggleNoticeStatus = async (noticeId) => {
  try {
    const response = await apiClient.patch(`/notice/${noticeId}/toggle`, {}, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Toggle notice error:", error.response?.data || error.message);
    throw error;
  }
};
