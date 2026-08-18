import apiClient from "@/src/lib/axios";

export const adjustBalance = async (data) => {
  const res = await apiClient.post("/balance-transaction/adjust", data, {
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

export const getBalanceHistory = async (userId, page = 1, limit = 20) => {
  const res = await apiClient.get(
    `/balance-transaction/history/${userId}?page=${page}&limit=${limit}`,
    { withCredentials: true }
  );
  return res.data;
};

export const getAllTransactions = async (page = 1, limit = 30, search = "") => {
  const res = await apiClient.get(
    `/balance-transaction/all?page=${page}&limit=${limit}&search=${search}`,
    { withCredentials: true }
  );
  return res.data;
};
