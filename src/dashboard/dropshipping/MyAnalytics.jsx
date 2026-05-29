"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";

import {
  BarChart3,
  DollarSign,
  Clock,
  TrendingUp,
  Activity,
  RefreshCw,
  Users,
  Target,
} from "lucide-react";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { getMyDropshippingAnalytics } from "@/src/hook/useDropshippingAnalytics";
import BackButton from "@/src/dropShipping/BackButton/BackButton";
import Container from "@/src/compronent/shared/Container";
import Link from "next/link";

const COLORS = ["#f59e0b", "#3b82f6", "#8b5cf6", "#10b981", "#ef4444"];

const MyAnalytics = () => {
  const data = useSelector((state) => state.user.data);
  const [dsAnalytics, setDsAnalytics] = useState(null);
  const [dsLoading, setDsLoading] = useState(false);
  const [timeRange, setTimeRange] = useState("all"); // '7d', '30d', 'all', 'custom'
  const [customDates, setCustomDates] = useState({ start: "", end: "" });
  const [referralTab, setReferralTab] = useState("partners"); // "partners" | "video_buyers"

  const fetchDSAnalytics = async () => {
    setDsLoading(true);
    try {
      let startDate, endDate;
      if (timeRange === "custom") {
        startDate = customDates.start
          ? new Date(customDates.start).toISOString()
          : null;
        endDate = customDates.end
          ? new Date(customDates.end).toISOString()
          : null;
      } else if (timeRange !== "all") {
        endDate = new Date().toISOString();
        const start = new Date();
        start.setDate(start.getDate() - (timeRange === "7d" ? 7 : 30));
        startDate = start.toISOString();
      }

      const res = await getMyDropshippingAnalytics(startDate, endDate);
      if (res.success) {
        setDsAnalytics(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch DS analytics", error);
    } finally {
      setDsLoading(false);
    }
  };

  useEffect(() => {
    if (
      data?._id &&
      (data?.role === "DROPSHIPPING" || data?.roles?.includes("DROPSHIPPING"))
    ) {
      if (timeRange !== "custom" || (customDates.start && customDates.end)) {
        fetchDSAnalytics();
      }
    }
  }, [data?._id, timeRange, customDates]);

  // Process trend data from transactions
  const trendData = useMemo(() => {
    if (!dsAnalytics?.transactions) return [];

    // Group by date and sum amount
    const groups = dsAnalytics.transactions.reduce((acc, tx) => {
      const date = new Date(tx.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      if (!acc[date]) acc[date] = 0;
      acc[date] += tx.amount;
      return acc;
    }, {});

    return Object.entries(groups)
      .map(([name, value]) => ({
        name,
        value,
        rawDate: new Date(name + ", " + new Date().getFullYear()),
      }))
      .sort((a, b) => a.rawDate - b.rawDate)
      .map(({ name, value }) => ({ name, value }));
  }, [dsAnalytics?.transactions]);

  // Process pie data for order pipeline
  const pipelineData = useMemo(() => {
    if (!dsAnalytics?.orderPipeline) return [];
    return Object.entries(dsAnalytics.orderPipeline)
      .filter(([_, value]) => value > 0)
      .map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
      }));
  }, [dsAnalytics?.orderPipeline]);

  if (dsLoading && !dsAnalytics) {
    return (
      <section className="min-h-[80vh] flex flex-col items-center justify-center gap-4 bg-slate-50/30">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-teal-500/10 rounded-full" />
          <div className="w-16 h-16 border-4 border-t-teal-500 rounded-full animate-spin absolute top-0 left-0" />
        </div>
        <div className="text-center">
          <p className="text-gray-900 font-bold text-lg">
            Analyzing Your Business
          </p>
          <p className="text-gray-500 text-sm">
            Fetching real-time performance data...
          </p>
        </div>
      </section>
    );
  }

  if (!dsAnalytics && !dsLoading) {
    return (
      <section className="min-h-[70dvh] bg-slate-50/30 py-10 md:py-16 grid place-items-center">
        <Container className="text-center flex flex-col items-center justify-center gap-6">
          <div className="w-20 h-20 bg-white shadow-xl rounded-3xl flex items-center justify-center mx-auto border border-gray-100 rotate-3">
            <BarChart3 className="w-10 h-10 text-teal-500 -rotate-3" />
          </div>
          <div className="max-w-md">
            <h3 className="text-xl font-black text-gray-900">No Data Yet</h3>
            <p className="text-gray-500 mt-2">
              Start dropshipping products to see your sales performance and
              referral network growth here.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <BackButton />
            <Link
              href="/"
              type="button"
              className="px-5 py-3.5 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition duration-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 hover:-translate-y-0.5 active:translate-y-0.5 active:scale-95 active:shadow-lg"
            >
              Back to Home
            </Link>
          </div>
        </Container>
      </section>
    );
  }

  const { summary } = dsAnalytics;

  return (
    <section className="min-h-screen bg-slate-50/30 pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <BackButton className="mb-6" />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-teal-600 font-bold text-sm uppercase tracking-widest">
            <Activity className="w-4 h-4" />
            <span>Business Intelligence</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
            Performance Analytics
          </h2>
          <p className="text-gray-500">
            Track your profit margins and network growth in real-time.
          </p>
        </div>

        <div className="flex flex-col items-end gap-3">
          <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
            {[
              { id: "7d", label: "7 Days" },
              { id: "30d", label: "30 Days" },
              { id: "all", label: "All Time" },
              { id: "custom", label: "Custom" },
            ].map((range) => (
              <button
                key={range.id}
                onClick={() => setTimeRange(range.id)}
                className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${
                  timeRange === range.id
                    ? "bg-teal-500 text-white shadow-lg shadow-teal-500/20"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>

          {timeRange === "custom" && (
            <div className="flex items-center gap-2 animate-in zoom-in-95 duration-300">
              <input
                type="date"
                value={customDates.start}
                onChange={(e) =>
                  setCustomDates((prev) => ({ ...prev, start: e.target.value }))
                }
                className="bg-white border border-gray-100 rounded-xl px-3 py-1.5 text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
              />
              <span className="text-gray-400 font-black">to</span>
              <input
                type="date"
                value={customDates.end}
                onChange={(e) =>
                  setCustomDates((prev) => ({ ...prev, end: e.target.value }))
                }
                className="bg-white border border-gray-100 rounded-xl px-3 py-1.5 text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
              />
            </div>
          )}
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Available Balance",
            value: summary.currentBalance || data?.balance || 0,
            icon: Target,
            color: "text-teal-600",
            bg: "bg-teal-50",
            border: "border-teal-100",
            trend: "Matches your navbar balance",
            isPrimary: true,
          },
          {
            label: "Total Sales Profit",
            value: summary.totalProfit,
            icon: DollarSign,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            border: "border-emerald-100",
            trend: "Historical sales earnings",
          },
          {
            label: "Pending Revenue",
            value: summary.pendingProfit,
            icon: Clock,
            color: "text-amber-600",
            bg: "bg-amber-50",
            border: "border-amber-100",
            trend: "Awaiting fulfillment",
          },
          {
            label: "Referral Income",
            value: summary.referralIncome,
            icon: TrendingUp,
            color: "text-blue-600",
            bg: "bg-blue-50",
            border: "border-blue-100",
            trend: "From your network",
          },
        ].map((kpi, idx) => (
          <div
            key={idx}
            className={`${kpi.bg} p-6 rounded-[2.5rem] border ${kpi.border} relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300 shadow-sm ${kpi.isPrimary ? "ring-2 ring-teal-500/20 ring-offset-2" : ""}`}
          >
            <div className="flex flex-col gap-4 relative z-10">
              <div className="flex items-center justify-between">
                <div className="bg-white/80 backdrop-blur-sm p-3 rounded-2xl shadow-sm">
                  <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
                </div>
                <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-tighter text-gray-400 max-w-[120px] text-right leading-tight">
                  {kpi.trend}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  {kpi.label}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className={`text-3xl font-black ${kpi.color}`}>
                    ৳{kpi.value.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            {/* Abstract Background Element */}
            <div
              className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-10 ${kpi.color.replace("text", "bg")} blur-2xl group-hover:scale-150 transition-transform duration-500`}
            />
          </div>
        ))}
      </div>

      {/* Visual Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profit Trend Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 relative group overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-teal-50 text-teal-600 rounded-xl">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">
                Earnings Trend
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
              <span className="w-2 h-2 rounded-full bg-teal-500" />
              Sales + Referral Profit
            </div>
          </div>

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 600 }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "20px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    padding: "12px 16px",
                  }}
                  formatter={(value) => [
                    `৳${value.toLocaleString()}`,
                    "Total Earned",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#14b8a6"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 relative group overflow-hidden">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <PieChart className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">
              Status Mix
            </h3>
          </div>

          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pipelineData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={8}
                  dataKey="value"
                  animationDuration={1500}
                >
                  {pipelineData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "15px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            {pipelineData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                />
                <span className="text-xs font-bold text-gray-600">
                  {item.name}
                </span>
                <span className="text-xs font-black text-gray-400 ml-auto">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Transactions */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                <RefreshCw className="w-4 h-4" />
              </div>
              <h3 className="font-black text-gray-900 uppercase tracking-tight">
                Recent Activity
              </h3>
            </div>
            <span className="text-[10px] font-black text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full uppercase">
              Last 100 Records
            </span>
          </div>
          <div className="p-2">
            <div className="max-h-[500px] overflow-y-auto scrollbar-hide px-2">
              <div className="space-y-1">
                {dsAnalytics.transactions.map((tx, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 rounded-3xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3 rounded-2xl transition-colors ${
                          tx.type === "profit"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-blue-50 text-blue-600"
                        }`}
                      >
                        {tx.type === "profit" ? (
                          <DollarSign className="w-4 h-4" />
                        ) : (
                          <Users className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-black text-gray-900">
                          {tx.type === "profit"
                            ? "Order Profit"
                            : `Referral Bonus: ${tx.user}`}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            #{tx.orderId.slice(-6).toUpperCase()}
                          </span>
                          <span className="text-[10px] text-gray-300">•</span>
                          <span className="text-[10px] font-medium text-gray-400">
                            {new Date(tx.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-sm font-black ${
                          tx.status === "credited"
                            ? "text-emerald-600"
                            : tx.status === "lost"
                              ? "text-red-500"
                              : "text-amber-500"
                        }`}
                      >
                        {tx.status === "credited" ? "+" : ""}৳
                        {tx.amount.toLocaleString()}
                      </p>
                      <p
                        className={`text-[10px] font-black uppercase tracking-tighter mt-0.5 ${
                          tx.status === "credited"
                            ? "text-emerald-500"
                            : tx.status === "lost"
                              ? "text-red-500"
                              : "text-amber-500"
                        }`}
                      >
                        {tx.status}
                      </p>
                    </div>
                  </div>
                ))}
                {dsAnalytics.transactions.length === 0 && (
                  <div className="py-20 text-center space-y-3">
                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                      <Activity className="w-5 h-5 text-gray-300" />
                    </div>
                    <p className="text-gray-400 text-xs font-medium italic">
                      No recent transactions recorded
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Referral Network List */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <Users className="w-4 h-4" />
              </div>
              <h3 className="font-black text-gray-900 uppercase tracking-tight">
                Referral Network
              </h3>
            </div>
            
            {/* Tab Toggles */}
            <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100/50 w-full sm:w-auto">
              <button
                onClick={() => setReferralTab("partners")}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                  referralTab === "partners"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-400 hover:text-gray-700"
                }`}
              >
                Partners ({summary.referralCount})
              </button>
              <button
                onClick={() => setReferralTab("video_buyers")}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                  referralTab === "video_buyers"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-400 hover:text-gray-700"
                }`}
              >
                Video Buyers ({(dsAnalytics.videoReferrals || []).length})
              </button>
            </div>
          </div>
          <div className="max-h-[500px] overflow-y-auto scrollbar-hide overflow-x-auto">
            {referralTab === "partners" ? (
              <table className="w-full text-left min-w-[600px]">
                <thead className="sticky top-0 bg-white z-10 shadow-sm">
                  <tr className="bg-slate-50/50">
                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Partner
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">
                      Sales
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">
                      Income
                    </th>
                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {dsAnalytics.referralNetwork.map((ref, idx) => (
                    <tr
                      key={idx}
                      className="group hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 font-black text-xs">
                            {ref.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-black text-gray-900">
                              {ref.name}
                            </p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                              Joined{" "}
                              {new Date(
                                ref.lastOrderDate || Date.now(),
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className="text-sm font-black text-gray-700 bg-gray-100 px-2 py-0.5 rounded-lg">
                          {ref.orderCount}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <p className="text-sm font-black text-blue-600">
                          ৳{ref.bonusEarned.toLocaleString()}
                        </p>
                        {ref.pendingBonus > 0 && (
                          <p className="text-[10px] text-amber-500 font-black tracking-tighter">
                            ৳{ref.pendingBonus.toLocaleString()} pending
                          </p>
                        )}
                      </td>
                      <td className="px-8 py-5 text-center">
                        <div
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            ref.isActive
                              ? "bg-emerald-100 text-emerald-600"
                              : "bg-slate-100 text-slate-400"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${ref.isActive ? "bg-emerald-500" : "bg-slate-400"}`}
                          />
                          {ref.isActive ? "Active" : "Idle"}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {dsAnalytics.referralNetwork.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center gap-3 opacity-30">
                          <Users className="w-10 h-10" />
                          <p className="text-xs font-black uppercase tracking-widest">
                            No Referral Data
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-left min-w-[700px]">
                <thead className="sticky top-0 bg-white z-10 shadow-sm">
                  <tr className="bg-slate-50/50">
                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Buyer
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Course Purchased
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">
                      Paid Amount
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">
                      Bonus Earned
                    </th>
                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {(dsAnalytics.videoReferrals || []).map((ref, idx) => (
                    <tr
                      key={idx}
                      className="group hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-xs">
                            {ref.buyerName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-black text-gray-900">
                              {ref.buyerName}
                            </p>
                            <p className="text-[10px] font-bold text-gray-400 truncate max-w-[180px]">
                              {ref.buyerEmail}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-sm font-bold text-gray-700 max-w-[220px] truncate">
                          {ref.courseTitle}
                        </p>
                        <p className="text-[10px] text-gray-400 font-medium">
                          {new Date(ref.createdAt).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className="text-sm font-black text-gray-700 bg-gray-100 px-2 py-0.5 rounded-lg">
                          ৳{ref.amount.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <p className="text-sm font-black text-emerald-600">
                          ৳{ref.bonusAmount.toLocaleString()}
                        </p>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <div
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            ref.status === "approved"
                              ? "bg-emerald-100 text-emerald-600"
                              : ref.status === "pending"
                                ? "bg-amber-100 text-amber-600"
                                : "bg-red-100 text-red-600"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              ref.status === "approved"
                                ? "bg-emerald-500"
                                : ref.status === "pending"
                                  ? "bg-amber-500"
                                  : "bg-red-500"
                            }`}
                          />
                          {ref.status}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {(!dsAnalytics.videoReferrals || dsAnalytics.videoReferrals.length === 0) && (
                    <tr>
                      <td colSpan={5} className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center gap-3 opacity-30">
                          <Users className="w-10 h-10" />
                          <p className="text-xs font-black uppercase tracking-widest">
                            No Video Referrals Data
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyAnalytics;
