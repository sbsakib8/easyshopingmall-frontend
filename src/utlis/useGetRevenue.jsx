"use client"
import { useMemo } from 'react';
import { useGetAllOrders } from './useGetAllOrders';

const useGetRevenue = () => {
    const { allOrders, loading } = useGetAllOrders()
    const totalRevenue = useMemo(() => {
    // const total = allOrders?.length
    // const completed = allOrders?.filter((o) => o?.order_status === "completed")?.length
    // const pending = allOrders?.filter((o) => o?.order_status === "pending")?.length
    // const processing = allOrders?.filter((o) => o?.order_status === "processing")?.length
    const revenue = allOrders?.filter((o) => o?.order_status === "completed")?.reduce((sum, o) => sum + o.totalAmt, 0)
    return revenue 
  }, [allOrders])
    return {totalRevenue,loading}
};

export default useGetRevenue;