"use client";

import { getDropshippingAnalytics } from "@/src/hook/useDropshippingAnalytics";
import {
  Award,
  Clock,
  DollarSign,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { useMemo, useState, useEffect } from "react";

export default function useDropshippingAnalytics() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("all");
  const [customDates, setCustomDates] = useState({ start: "", end: "" });
  const [expandedDropshipper, setExpandedDropshipper] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 6;

  const fetchData = async () => {
    setLoading(true);
    let startDate, endDate;
    const now = new Date();

    if (dateRange === "today") {
      startDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
      ).toISOString();
      endDate = now.toISOString();
    } else if (dateRange === "7days") {
      startDate = new Date(now.setDate(now.getDate() - 7)).toISOString();
      endDate = new Date().toISOString();
    } else if (dateRange === "30days") {
      startDate = new Date(now.setDate(now.getDate() - 30)).toISOString();
      endDate = new Date().toISOString();
    } else if (dateRange === "custom") {
      startDate = customDates.start
        ? new Date(customDates.start).toISOString()
        : null;
      endDate = customDates.end
        ? new Date(customDates.end).toISOString()
        : null;
    }

    try {
      const res = await getDropshippingAnalytics(startDate, endDate);

      if (!res?.success) {
        setData({});
        return;
      }

      setData(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (dateRange !== "custom" || (customDates.start && customDates.end)) {
      fetchData();
    }
  }, [dateRange, customDates]);

  const trendData = useMemo(() => {
    if (!data?.recentActivity) return [];

    const groups = data.recentActivity.reduce((acc, event) => {
      const date = new Date(event.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      if (!acc[date]) acc[date] = { name: date, revenue: 0, profit: 0 };
      acc[date].profit += event.amount;

      return acc;
    }, {});

    return Object.values(groups)
      .map((d) => ({
        ...d,
        rawDate: new Date(d.name + ", " + new Date().getFullYear()),
      }))
      .sort((a, b) => a.rawDate - b.rawDate);
  }, [data?.recentActivity]);

  const pipelineData = useMemo(() => {
    if (!data?.orderPipeline) return [];

    return Object.entries(data.orderPipeline)
      .filter(([_, value]) => value > 0)
      .map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
      }));
  }, [data?.orderPipeline]);

  const { summary = {}, dropshippers = [], recentActivity = [] } = data;

  const filteredDropshippers = useMemo(() => {
    return dropshippers
      .filter((ds) => {
        const matchesSearch =
          !searchTerm ||
          ds.name?.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
          ds.shopName?.toLowerCase().includes(searchTerm.trim().toLowerCase());

        let matchesFilter = true;
        if (filterType === "new" || filterType === "old") {
          const joinedDate = new Date(ds.joinedAt);
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

          if (filterType === "new") {
            matchesFilter = joinedDate >= thirtyDaysAgo;
          } else {
            matchesFilter = joinedDate < thirtyDaysAgo;
          }
        }
        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => new Date(b.joinedAt) - new Date(a.joinedAt));
  }, [dropshippers, searchTerm, filterType]);

  const totalPages = Math.ceil(filteredDropshippers.length / itemsPerPage);
  const paginatedDropshippers = filteredDropshippers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const kpiCards = [
    {
      label: "Total Revenue",
      value: summary.totalRevenue ?? 0,
      icon: DollarSign,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Profit Paid",
      value: summary.totalProfitPaid ?? 0,
      icon: Wallet,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      label: "Referral Paid",
      value: summary.totalReferralPaid ?? 0,
      icon: Award,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
    {
      label: "Net Income",
      value: summary.platformNetIncome ?? 0,
      icon: TrendingUp,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
    {
      label: "Pending Orders",
      value: summary.pendingOrders ?? 0,
      icon: Clock,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
      isCurrency: false,
    },
    {
      label: "Active Partners",
      value: summary.activeDropshippers ?? 0,
      icon: Users,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
      isCurrency: false,
      subtitle: `${summary?.totalDropshippers ?? 0} registered`,
    },
  ];

  const pipelineDataLength = pipelineData?.length ?? 0;
  const trendDataLength = trendData?.length ?? 0;

  return {
    loading,
    dateRange,
    setDateRange,
    customDates,
    setCustomDates,
    expandedDropshipper,
    setExpandedDropshipper,
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    kpiCards,
    trendData,
    pipelineData,
    summary,
    dropshippers,
    recentActivity,
    filteredDropshippers,
    totalPages,
    paginatedDropshippers,
    pipelineDataLength,
    trendDataLength,
  };
}
