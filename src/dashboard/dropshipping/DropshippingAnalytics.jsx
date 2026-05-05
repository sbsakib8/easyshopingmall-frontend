"use client";

import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Package,
  Clock,
  XCircle,
  CheckCircle,
  Truck,
  RefreshCw,
  ArrowRight,
  Award,
  Activity,
  Eye,
  ChevronDown,
  BarChart3,
  Wallet,
} from "lucide-react";
import { getDropshippingAnalytics } from "@/src/hook/useDropshippingAnalytics";

export default function DropshippingAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("all");
  const [expandedDropshipper, setExpandedDropshipper] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    let startDate, endDate;
    const now = new Date();

    if (dateRange === "today") {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      endDate = now.toISOString();
    } else if (dateRange === "7days") {
      startDate = new Date(now.setDate(now.getDate() - 7)).toISOString();
      endDate = new Date().toISOString();
    } else if (dateRange === "30days") {
      startDate = new Date(now.setDate(now.getDate() - 30)).toISOString();
      endDate = new Date().toISOString();
    }

    const res = await getDropshippingAnalytics(startDate, endDate);
    if (res?.success) {
      setData(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-gray-400 font-medium animate-pulse">Loading Analytics...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
        <p className="text-red-400 font-bold">Failed to load analytics data.</p>
      </div>
    );
  }

  const { summary, orderPipeline, dropshippers, recentActivity } = data;

  const kpiCards = [
    {
      label: "Total Revenue",
      value: summary.totalRevenue,
      icon: DollarSign,
      color: "from-emerald-500 to-green-600",
      textColor: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
    },
    {
      label: "Profit Paid Out",
      value: summary.totalProfitPaid,
      icon: Wallet,
      color: "from-blue-500 to-cyan-600",
      textColor: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Referral Bonus Paid",
      value: summary.totalReferralPaid,
      icon: Award,
      color: "from-purple-500 to-violet-600",
      textColor: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
    {
      label: "Platform Net Income",
      value: summary.platformNetIncome,
      icon: TrendingUp,
      color: "from-amber-500 to-orange-600",
      textColor: "text-amber-400",
      bgColor: "bg-amber-500/10",
    },
    {
      label: "Pending Orders",
      value: summary.pendingOrders,
      icon: Clock,
      color: "from-yellow-500 to-amber-600",
      textColor: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
      isCurrency: false,
    },
    {
      label: "Active Dropshippers",
      value: summary.activeDropshippers,
      icon: Users,
      color: "from-cyan-500 to-teal-600",
      textColor: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
      isCurrency: false,
      subtitle: `of ${summary.totalDropshippers} total`,
    },
  ];

  const pipelineStages = [
    { key: "pending", label: "Pending", icon: Clock, color: "bg-yellow-500", textColor: "text-yellow-400" },
    { key: "processing", label: "Processing", icon: RefreshCw, color: "bg-blue-500", textColor: "text-blue-400" },
    { key: "shipped", label: "Shipped", icon: Truck, color: "bg-purple-500", textColor: "text-purple-400" },
    { key: "delivered", label: "Delivered", icon: CheckCircle, color: "bg-emerald-500", textColor: "text-emerald-400" },
    { key: "completed", label: "Completed", icon: CheckCircle, color: "bg-green-500", textColor: "text-green-400" },
    { key: "cancelled", label: "Cancelled", icon: XCircle, color: "bg-red-500", textColor: "text-red-400" },
  ];

  const totalPipelineOrders = Object.values(orderPipeline).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-4 md:p-6 lg:p-8 text-white">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Dropshipping Analytics
            </h1>
            <p className="text-gray-500 text-sm mt-1">Business intelligence for your dropshipping operations</p>
          </div>

          {/* Date Range Filter */}
          <div className="flex items-center gap-2 bg-gray-800/50 rounded-xl p-1 border border-gray-700/50">
            {[
              { key: "today", label: "Today" },
              { key: "7days", label: "7 Days" },
              { key: "30days", label: "30 Days" },
              { key: "all", label: "All Time" },
            ].map((range) => (
              <button
                key={range.key}
                onClick={() => setDateRange(range.key)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  dateRange === range.key
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                    : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Section 1: KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {kpiCards.map((card) => (
            <div
              key={card.label}
              className="relative overflow-hidden bg-gray-800/40 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/30 hover:border-gray-600/50 transition-all group"
            >
              <div className={`absolute top-0 right-0 w-20 h-20 rounded-full ${card.bgColor} blur-2xl opacity-50 group-hover:opacity-80 transition-opacity`} />
              <div className="relative z-10">
                <div className={`w-10 h-10 rounded-xl ${card.bgColor} flex items-center justify-center mb-3`}>
                  <card.icon className={`w-5 h-5 ${card.textColor}`} />
                </div>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">{card.label}</p>
                <p className={`text-2xl font-black tracking-tight ${card.textColor}`}>
                  {card.isCurrency === false
                    ? card.value.toLocaleString()
                    : `৳${card.value.toLocaleString()}`}
                </p>
                {card.subtitle && (
                  <p className="text-[10px] text-gray-600 mt-1">{card.subtitle}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Cancelled Orders Alert */}
        {summary.cancelledOrders > 0 && (
          <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
              <TrendingDown className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-red-300 font-bold text-sm">
                {summary.cancelledOrders} orders cancelled — ৳{summary.cancelledValue.toLocaleString()} potential revenue lost
              </p>
              <p className="text-red-400/60 text-xs">Review cancelled orders to identify patterns and reduce loss</p>
            </div>
          </div>
        )}

        {/* Section 2: Order Pipeline */}
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/30">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Order Pipeline</h2>
              <p className="text-xs text-gray-500">{totalPipelineOrders} total orders across all stages</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {pipelineStages.map((stage) => {
              const count = orderPipeline[stage.key] || 0;
              const percentage = totalPipelineOrders > 0 ? ((count / totalPipelineOrders) * 100).toFixed(1) : 0;
              return (
                <div key={stage.key} className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/20">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-2 h-2 rounded-full ${stage.color}`} />
                    <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">{stage.label}</span>
                  </div>
                  <p className={`text-3xl font-black ${stage.textColor}`}>{count}</p>
                  <div className="mt-2 w-full bg-gray-800 rounded-full h-1.5">
                    <div className={`${stage.color} h-1.5 rounded-full transition-all`} style={{ width: `${percentage}%` }} />
                  </div>
                  <p className="text-[10px] text-gray-600 mt-1">{percentage}%</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3: Dropshipper Financial Table */}
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/30 overflow-hidden">
          <div className="p-6 border-b border-gray-700/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Dropshipper Performance</h2>
                <p className="text-xs text-gray-500">{dropshippers.length} registered dropshippers</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-900/50 border-b border-gray-700/20">
                  <th className="px-6 py-3 text-[10px] font-black text-gray-500 uppercase tracking-widest">Dropshipper</th>
                  <th className="px-4 py-3 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">Orders</th>
                  <th className="px-4 py-3 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">Completed</th>
                  <th className="px-4 py-3 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">Cancelled</th>
                  <th className="px-4 py-3 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Revenue</th>
                  <th className="px-4 py-3 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Profit Paid</th>
                  <th className="px-4 py-3 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Referral Paid</th>
                  <th className="px-4 py-3 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Balance</th>
                  <th className="px-4 py-3 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">Referrals</th>
                </tr>
              </thead>
              <tbody>
                {dropshippers.map((ds) => (
                  <React.Fragment key={ds._id}>
                    <tr
                      className="border-b border-gray-700/10 hover:bg-gray-800/50 transition-colors cursor-pointer"
                      onClick={() =>
                        setExpandedDropshipper(
                          expandedDropshipper === ds._id ? null : ds._id
                        )
                      }
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-sm">
                            {ds.name?.charAt(0)?.toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">{ds.name}</p>
                            <p className="text-[10px] text-gray-500">{ds.shopName}</p>
                          </div>
                          {ds.referredUsers?.length > 0 && (
                            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${expandedDropshipper === ds._id ? "rotate-180" : ""}`} />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center text-sm font-bold text-gray-300">{ds.totalOrders}</td>
                      <td className="px-4 py-4 text-center text-sm font-bold text-emerald-400">{ds.completedOrders}</td>
                      <td className="px-4 py-4 text-center text-sm font-bold text-red-400">{ds.cancelledOrders}</td>
                      <td className="px-4 py-4 text-right text-sm font-bold text-green-400">৳{ds.revenue.toLocaleString()}</td>
                      <td className="px-4 py-4 text-right text-sm font-bold text-blue-400">৳{ds.profitPaid.toLocaleString()}</td>
                      <td className="px-4 py-4 text-right text-sm font-bold text-purple-400">৳{ds.referralPaid.toLocaleString()}</td>
                      <td className="px-4 py-4 text-right text-sm font-black text-amber-400">৳{ds.balance.toLocaleString()}</td>
                      <td className="px-4 py-4 text-center">
                        <span className="text-xs font-bold bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full">
                          {ds.referredUsers?.length || 0}
                        </span>
                      </td>
                    </tr>

                    {/* Expanded: Referral Network */}
                    {expandedDropshipper === ds._id && ds.referredUsers?.length > 0 && (
                      <tr>
                        <td colSpan={9} className="px-6 py-4 bg-gray-900/50">
                          <div className="rounded-xl border border-indigo-500/20 overflow-hidden">
                            <div className="bg-indigo-500/5 px-4 py-2 border-b border-indigo-500/10">
                              <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                                Referral Network — Users referred by {ds.name}
                              </p>
                            </div>
                            <table className="w-full">
                              <thead>
                                <tr className="border-b border-gray-700/20">
                                  <th className="px-4 py-2 text-[10px] font-black text-gray-500 uppercase text-left">User</th>
                                  <th className="px-4 py-2 text-[10px] font-black text-gray-500 uppercase text-center">Orders</th>
                                  <th className="px-4 py-2 text-[10px] font-black text-gray-500 uppercase text-center">Last Order</th>
                                  <th className="px-4 py-2 text-[10px] font-black text-gray-500 uppercase text-right">Bonus Earned</th>
                                  <th className="px-4 py-2 text-[10px] font-black text-gray-500 uppercase text-center">Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {ds.referredUsers.map((ref, idx) => (
                                  <tr key={idx} className="border-b border-gray-800/30 last:border-0">
                                    <td className="px-4 py-2 text-sm text-gray-300 font-medium">{ref.name}</td>
                                    <td className="px-4 py-2 text-sm text-center text-gray-400">{ref.orderCount}</td>
                                    <td className="px-4 py-2 text-sm text-center text-gray-500">
                                      {ref.lastOrderDate
                                        ? new Date(ref.lastOrderDate).toLocaleDateString()
                                        : "Never"}
                                    </td>
                                    <td className="px-4 py-2 text-sm text-right text-purple-400 font-bold">
                                      ৳{ref.bonusEarned.toLocaleString()}
                                    </td>
                                    <td className="px-4 py-2 text-center">
                                      <span
                                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                          ref.isActive
                                            ? "bg-green-500/20 text-green-400"
                                            : "bg-gray-700/50 text-gray-500"
                                        }`}
                                      >
                                        {ref.isActive ? "Active" : "Inactive"}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}

                {dropshippers.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-gray-600">
                      No dropshippers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 5: Recent Activity Feed */}
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/30">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Recent Payouts</h2>
              <p className="text-xs text-gray-500">Latest profit and referral distributions</p>
            </div>
          </div>

          <div className="space-y-3">
            {recentActivity?.length > 0 ? (
              recentActivity.slice(0, 15).map((event, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-3 rounded-xl bg-gray-900/30 border border-gray-700/10 hover:border-gray-600/30 transition-all"
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      event.type === "profit"
                        ? "bg-blue-500/20"
                        : "bg-purple-500/20"
                    }`}
                  >
                    {event.type === "profit" ? (
                      <DollarSign className="w-4 h-4 text-blue-400" />
                    ) : (
                      <Award className="w-4 h-4 text-purple-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-300">
                      <span className={`font-bold ${event.type === "profit" ? "text-blue-400" : "text-purple-400"}`}>
                        ৳{event.amount.toLocaleString()}
                      </span>{" "}
                      {event.type === "profit" ? "sales profit" : "referral bonus"} paid to{" "}
                      <span className="font-bold text-white">{event.dropshipper}</span>
                    </p>
                    <p className="text-[10px] text-gray-600">
                      Order #{event.orderId?.slice(-8)?.toUpperCase()}
                    </p>
                  </div>
                  <p className="text-[10px] text-gray-600 shrink-0">
                    {new Date(event.date).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-600">
                <Activity className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No recent payout activity</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
