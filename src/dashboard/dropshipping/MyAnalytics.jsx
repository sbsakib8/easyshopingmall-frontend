"use client";

import {
  Activity,
  BarChart3,
  DollarSign,
  RefreshCw,
  Users,
} from "lucide-react";

import Container from "@/src/compronent/shared/Container";
import Section from "@/src/compronent/shared/Section";
import BackButton from "@/src/dropShipping/BackButton/BackButton";
import Link from "next/link";

import useMyAnalytics from "./useMyAnalytics";
import MyStatsCards from "./MyStatsCards";
import MyAnalyticsCharts from "./MyAnalyticsCharts";
import ReferralNetworkTable from "./ReferralNetworkTable";

const MyAnalytics = () => {
  const {
    data,
    dsAnalytics,
    dsLoading,
    timeRange,
    setTimeRange,
    customDates,
    setCustomDates,
    referralTab,
    setReferralTab,
    trendData,
    pipelineData,
  } = useMyAnalytics();

  if (!dsLoading && !dsAnalytics) {
    return (
      <Section className="min-h-[70dvh] bg-slate-50/30 py-8 md:py-14 grid place-items-center">
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
      </Section>
    );
  }

  const { summary = {} } = dsAnalytics || {};

  return (
    <Section className="min-h-dvh bg-slate-50/30 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Container className="space-y-12">
        <BackButton />

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-teal-600 font-bold text-sm uppercase tracking-widest">
              <Activity className="w-4 h-4" />
              <span>Business Intelligence</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
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
                    setCustomDates((prev) => ({
                      ...prev,
                      start: e.target.value,
                    }))
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

        {/* Stats Cards */}
        <MyStatsCards summary={summary} data={data} dsLoading={dsLoading} />

        {/* Charts */}
        <MyAnalyticsCharts
          dsLoading={dsLoading}
          trendData={trendData}
          pipelineData={pipelineData}
        />

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
                  {dsLoading ? (
                    <>
                      {Array.from({ length: 6 }).map((_, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-4 rounded-3xl border border-transparent animate-pulse"
                        >
                          <div className="flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-slate-200 w-10 h-10" />

                            <div>
                              <div className="h-4 w-44 bg-slate-200 rounded mb-2" />
                              <div className="flex items-center gap-2">
                                <div className="h-3 w-14 bg-slate-200 rounded" />
                                <div className="h-3 w-18 bg-slate-200 rounded" />
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="h-4 w-20 bg-slate-200 rounded ml-auto mb-2" />
                            <div className="h-3 w-12 bg-slate-200 rounded ml-auto" />
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    dsAnalytics.transactions.map((tx, idx) => (
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
                              <span className="text-[10px] text-gray-300">
                                •
                              </span>
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
                    ))
                  )}

                  {!dsLoading && dsAnalytics.transactions.length === 0 && (
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

          {/* Referral Network */}
          <ReferralNetworkTable
            dsLoading={dsLoading}
            dsAnalytics={dsAnalytics}
            referralTab={referralTab}
            setReferralTab={setReferralTab}
            summary={summary}
          />
        </div>
      </Container>
    </Section>
  );
};

export default MyAnalytics;
