"use client";

import {
  PieChart as PieChartIcon,
  Target,
  TrendingUp,
} from "lucide-react";
import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "./Charts";

const COLORS = [
  "#6366f1",
  "#3b82f6",
  "#8b5cf6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
];

function EmptyState({
  icon: Icon = TrendingUp,
  title = "No Data Available",
  description = "There is no data to display at the moment.",
  className = "",
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-16 px-6 text-center bg-gray-900/50 border border-gray-800 rounded-3xl ${className}`}
    >
      <div className="size-20 mx-auto bg-gray-800 rounded-3xl flex items-center justify-center mb-6 border border-gray-700">
        <Icon className="size-10 text-gray-500" />
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-gray-300">{title}</h3>
        <p className="text-gray-500 max-w-sm">{description}</p>
      </div>
    </div>
  );
}

export default function AnalyticsCharts({
  loading,
  trendData,
  pipelineData,
  trendDataLength,
  pipelineDataLength,
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Payout Trend Chart */}
      <div className="lg:col-span-2 bg-gray-900/40 border border-gray-800 rounded-[3rem] p-8 relative overflow-hidden group space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center shadow-lg">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white uppercase tracking-tight">
                Payout Trend
              </h3>
              <p className="text-xs text-gray-500">
                Historical profit distribution analysis
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs font-black text-gray-500 uppercase tracking-widest bg-gray-950/50 px-4 py-2 rounded-xl ml-12 sm:ml-0">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
              Platform Payouts
            </div>
          </div>
        </div>

        {loading ? (
          <div className="overflow-x-auto scrollbar-hide rounded-2xl border border-gray-800 bg-gray-900/50 p-1 animate-pulse">
            <div className="min-w-[700px] md:min-w-full h-[380px] md:h-[420px] relative bg-slate-950/50 rounded-xl overflow-hidden">
              <div className="absolute left-4 top-6 bottom-12 w-10 flex flex-col justify-between text-right">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-3 w-8 bg-slate-700 rounded" />
                ))}
              </div>

              <div className="absolute inset-0 pt-8 pb-12 px-14">
                <div className="absolute inset-0 flex flex-col justify-between py-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-px w-full bg-slate-800" />
                  ))}
                </div>

                <div className="absolute bottom-12 left-12 right-8 h-3/4">
                  <div
                    className="w-full h-full bg-gradient-to-t from-indigo-500/30 to-transparent rounded"
                    style={{
                      clipPath:
                        "polygon(0 85%, 8% 65%, 18% 75%, 32% 45%, 48% 55%, 65% 35%, 78% 50%, 92% 28%, 100% 40%, 100% 100%, 0 100%)",
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-indigo-400/80" />
                </div>
              </div>

              <div className="absolute bottom-6 left-14 right-8 flex justify-between">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-3 w-10 bg-slate-700 rounded text-center"
                  />
                ))}
              </div>

              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_2.5s_infinite]" />
            </div>
          </div>
        ) : trendDataLength === 0 ? (
          <EmptyState
            icon={TrendingUp}
            title="No Trend Data Available"
            description="There is no sales or payout data for the selected time period."
          />
        ) : (
          <div className="w-full">
            <div className="overflow-x-auto scrollbar-hide rounded-2xl border border-gray-800 bg-gray-900/50 p-1">
              <div className="min-w-[700px] md:min-w-full h-[380px] md:h-[420px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient
                        id="colorAdmin"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#6366f1"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#6366f1"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>

                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#1e293b"
                    />

                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fill: "#94a3b8",
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                      interval={0}
                    />

                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fill: "#94a3b8",
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                      tickFormatter={(val) =>
                        `৳${val > 999 ? (val / 1000).toFixed(1) + "k" : val}`
                      }
                    />

                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e2937",
                        borderRadius: "18px",
                        border: "1px solid #475569",
                        boxShadow: "0 30px 60px -15px rgb(0 0 0 / 0.7)",
                        padding: "16px 20px",
                        color: "#f8fafc",
                      }}
                      itemStyle={{ color: "#c7d2fe", fontWeight: 700 }}
                      labelStyle={{
                        color: "#94a3b8",
                        fontSize: "12px",
                        fontWeight: 500,
                      }}
                      formatter={(value) => [
                        `৳${value.toLocaleString()}`,
                        "Total Payouts",
                      ]}
                      cursor={{ stroke: "#818cf8", strokeWidth: 2 }}
                    />

                    <Area
                      type="monotone"
                      dataKey="profit"
                      stroke="#6366f1"
                      strokeWidth={4}
                      fillOpacity={1}
                      fill="url(#colorAdmin)"
                      animationDuration={2000}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Order Status Mix */}
      <div className="bg-gray-900/40 border border-gray-800 rounded-[3rem] p-8 relative overflow-hidden">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center shadow-lg">
            <PieChart className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white uppercase tracking-tight">
              Status Mix
            </h3>
            <p className="text-xs text-gray-500">
              Order lifecycle distribution
            </p>
          </div>
        </div>

        {loading ? (
          <>
            <div className="h-[280px] w-full flex items-center justify-center">
              <div className="relative w-[240px] h-[240px] animate-pulse">
                <div className="w-full h-full rounded-full border-[35px] border-slate-700 relative">
                  <div className="absolute inset-[38px] bg-slate-900 rounded-full" />

                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `conic-gradient(#a855f7 0deg 80deg, #06b6d4 80deg 160deg, #eab308 160deg 250deg, #ef4444 250deg 360deg)`,
                      opacity: 0.5,
                    }}
                  />
                </div>
              </div>
            </div>

            {[...Array.from({ length: 4 })].map((_, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1.5 justify-between p-2 rounded-xl bg-gray-950/30 border border-gray-800/50 animate-pulse"
              >
                <div className="flex items-center gap-2">
                  <div className="size-2.5 rounded-full bg-slate-700" />
                  <div className="h-3 w-20 bg-slate-700 rounded" />
                </div>
                <div className="h-3 w-12 bg-slate-700 rounded" />
              </div>
            ))}
          </>
        ) : pipelineDataLength !== 0 ? (
          <>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pipelineData}
                    cx="50%"
                    cy="50%"
                    innerRadius={75}
                    outerRadius={105}
                    paddingAngle={8}
                    dataKey="value"
                    animationDuration={1500}
                  >
                    {pipelineData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        stroke="rgba(0,0,0,0)"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderRadius: "15px",
                      border: "1px solid #1e293b",
                      color: "#ffffff",
                      fontSize: "13px",
                      padding: "8px 12px",
                    }}
                    itemStyle={{ color: "#ffffff" }}
                    labelStyle={{ color: "#cbd5e1" }}
                    cursor={{ stroke: "#64748b", strokeWidth: 1 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2 gap-x-6 gap-y-3 mt-6">
              {pipelineData.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 justify-between p-2 rounded-xl bg-gray-950/30 border border-gray-800/50"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div
                      className="size-2.5 flex items-center justify-center rounded-full"
                      style={{
                        backgroundColor: COLORS[idx % COLORS.length],
                      }}
                    />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-xs font-black text-white">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <EmptyState
            icon={PieChartIcon}
            title="No Pipeline Data"
            description="There is no data available to display in the pipeline chart."
          />
        )}
      </div>
    </div>
  );
}
